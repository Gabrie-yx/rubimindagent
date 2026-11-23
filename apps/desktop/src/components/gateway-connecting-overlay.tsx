import type { ConnectionState } from '@hermes/shared'
import { useStore } from '@nanostores/react'
import { useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { DecodeText } from '@/components/ui/decode-text'
import { prefersReducedMotion } from '@/hooks/use-media-query'
import { useI18n } from '@/i18n'
import { cn } from '@/lib/utils'
import { $desktopBoot, type DesktopBootState } from '@/store/boot'
import { $gatewaySwitching } from '@/store/gateway-switch'
import { $decideExit, $introStartExit, $introView } from '@/store/onboarding-intro'
import { $onboardingDecided } from '@/store/onboarding-presence'
import { $gatewayState } from '@/store/session'
import { isMainWindow } from '@/store/windows'

// Decode mechanics live in the shared <DecodeText> primitive
// (components/ui/decode-text.tsx). "CONN" stays legible via prefix={4}.
const TEXT = 'RUBIMIND'

// Exit choreography (ms): text fades down + out, hold, then the overlay fades.
const TEXT_OUT_MS = 360
const POST_TEXT_HOLD_MS = 300
const OVERLAY_OUT_MS = 520
// Preview-only: how long to "connect" for, and the pause before replaying.
const PREVIEW_CONNECT_MS = 2600
const PREVIEW_REPLAY_MS = 1100

type Phase = 'live' | 'text-out' | 'overlay-out' | 'gone'

// Dev affordance: a warm Cmd+R reconnects almost instantly, so the overlay
// only flashes. Load with `?connecting=1` to force a looping preview.
function forcedPreview(): boolean {
  if (!import.meta.env.DEV || typeof window === 'undefined') {
    return false
  }

  try {
    return new URLSearchParams(window.location.search).get('connecting') === '1'
  } catch {
    return false
  }
}

// The full-screen connecting overlay is for initial boot only. After a
// healthy boot, flaky networks / sleep-wake can drop the socket and flip the
// gateway state back to closed/error while the app reconnects. Do not cover
// the chat then — users should still be able to type drafts, open settings,
// and recover instead of staring at a modal CONNECTING screen.
function isInitialConnect(
  boot: DesktopBootState,
  gatewaySwitching: boolean,
  gatewayState: ConnectionState,
  coldBootDone: boolean
): boolean {
  const initialBootActive = boot.visible || boot.running || boot.progress < 100

  return !coldBootDone && !gatewaySwitching && gatewayState !== 'open' && !boot.error && initialBootActive
}

interface ConnectingOverlayViewProps {
  decoding: boolean
  onExit: (() => void) | null
  phase: Phase
}

/** The first-run start outlasted the boot budget: it keeps waiting, and the person may go on without setup. */
function SlowSetupStart({ onExit }: { onExit: () => void }) {
  const { t } = useI18n()

  return (
    <div className="grid max-w-xs justify-items-center gap-3 text-center" role="status">
      <div className="text-sm font-medium text-foreground">{t.onboarding.setupSlowTitle}</div>
      <div className="text-xs text-muted-foreground">{t.onboarding.setupSlowBody}</div>
      <Button onClick={onExit} size="sm" type="button" variant="secondary">
        {t.onboarding.continueWithoutSetup}
      </Button>
    </div>
  )
}

function ConnectingOverlayView({ decoding, onExit, phase }: ConnectingOverlayViewProps) {
  const leaving = phase !== 'live'
  const overlayHidden = phase === 'overlay-out' || phase === 'gone'

  return (
    <div
      className={cn(
        'fixed inset-0 z-(--z-connecting) grid place-items-center bg-(--ui-chat-surface-background) transition-opacity duration-500 ease-out',
        overlayHidden ? 'pointer-events-none opacity-0' : 'opacity-100'
      )}
      // Masks the whole app while booting — must stay filled under window
      // glass or the shell shows through. Contract: `[data-glass-opaque]`
      // in styles.css.
      data-glass-opaque=""
    >
      {onExit ? (
        <SlowSetupStart onExit={onExit} />
      ) : (
        <div className="flex flex-col items-center justify-center gap-6 select-none">
          {/* Logo container with subtle ambient glow */}
          <div className="relative flex items-center justify-center">
            <div className="absolute -inset-4 rounded-3xl bg-red-600/10 blur-xl animate-pulse" />
            <div className="relative h-20 w-20 rounded-2xl bg-zinc-950/80 p-2.5 shadow-2xl ring-1 ring-red-500/20 backdrop-blur-md">
              <img
                src="/rubimind.png"
                alt="RUBIMIND"
                className="h-full w-full object-contain filter drop-shadow-[0_2px_8px_rgba(220,38,38,0.4)]"
              />
            </div>
          </div>

          {/* Typography & Subtitle */}
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-xl font-bold tracking-[0.25em] text-zinc-100 flex items-center gap-2">
              <span>RUBI</span>
              <span className="text-red-500 font-extrabold drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">MIND</span>
            </h1>
            <p className="text-[11px] font-medium tracking-[0.18em] uppercase text-zinc-500">
              Personal AI Intelligence
            </p>
          </div>

          {/* Minimalist sleek progress bar */}
          <div className="w-56 mt-2 flex flex-col items-center gap-2">
            <div className="relative h-1 w-full overflow-hidden rounded-full bg-zinc-900 ring-1 ring-zinc-800">
              <div className="rubimind-progress-bar absolute inset-y-0 left-0 w-2/5 rounded-full bg-gradient-to-r from-red-600 via-rose-500 to-red-400 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
            </div>
            <span className="text-[10px] text-zinc-500 font-mono tracking-wider">
              CONECTANDO AO GATEWAY...
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Held until the app knows whether onboarding runs, so the chat never flashes before it. The due check
 * has no deadline: past its budget (`decideOnboarding`) this overlay offers Continue, which releases the
 * app for this launch. Once onboarding runs, the first-run intro's `starting` screen is this overlay and
 * stays up until its chat is open, offering a way out when the start is slow. A rerun from Settings
 * brings that screen back after boot.
 */
function useOnboardingHold(previewing: boolean) {
  const onboardingDecided = useStore($onboardingDecided)
  const introView = useStore($introView)
  const introStartExit = useStore($introStartExit)
  const decideExit = useStore($decideExit)

  const watching = !previewing && isMainWindow()
  const introStarting = watching && introView === 'starting'
  const deciding = watching && !onboardingDecided

  return {
    holds: introStarting || deciding,
    introStarting,
    onExit: introStarting ? introStartExit : deciding ? decideExit : null
  }
}

export function GatewayConnectingOverlay() {
  const gatewayState = useStore($gatewayState)
  const boot = useStore($desktopBoot)
  const gatewaySwitching = useStore($gatewaySwitching)
  const [previewing] = useState(forcedPreview)
  const { holds: onboardingHolds, introStarting, onExit } = useOnboardingHold(previewing)
  const reduce = prefersReducedMotion()
  // Under reduced motion, skip the multi-phase exit choreography (text-out →
  // hold → overlay fade) and jump straight to gone so the overlay unmounts
  // the instant the gateway opens. E2E screenshots rely on this to avoid
  // catching the overlay mid-fade.
  const [phase, setPhase] = useState<Phase>('live')
  // Once cold boot has completed once, never resurrect the fullscreen overlay
  // — soft gateway switches keep the shell and reskeleton the sidebar instead.
  const coldBootDoneRef = useRef(false)

  if (!boot.running && boot.progress >= 100 && !boot.error) {
    coldBootDoneRef.current = true
  }

  const connecting = isInitialConnect(boot, gatewaySwitching, gatewayState, coldBootDoneRef.current)

  // Latches once we've actually shown the overlay, so the brief frame where
  // gatewayState flips to "open" (connecting -> false) before the exit phase
  // kicks in doesn't unmount us and cause a flash.
  const shownRef = useRef(false)

  // Run onboarding again (Settings) brings the starting screen back over an app that already booted.
  if (previewing || connecting || introStarting) {
    shownRef.current = true
  }

  useEffect(() => {
    if (introStarting && phase !== 'live') {
      setPhase('live')
    }
  }, [introStarting, phase])

  // Kick off the exit when connected: real connect, or a faked timer in preview.
  useEffect(() => {
    if (phase !== 'live') {
      return
    }

    if (previewing) {
      const id = window.setTimeout(() => setPhase('text-out'), PREVIEW_CONNECT_MS)

      return () => window.clearTimeout(id)
    }

    if (gatewayState === 'open' && shownRef.current && !onboardingHolds) {
      // Under reduced motion, skip the multi-phase exit choreography
      // (text-out → hold → overlay fade) and jump straight to gone so the
      // overlay unmounts the instant the gateway opens. E2E screenshots
      // rely on this to avoid catching the overlay mid-fade.
      setPhase(reduce ? 'gone' : 'text-out')
    }
  }, [phase, previewing, gatewayState, onboardingHolds, reduce])

  // Advance the exit choreography: text-out -> overlay-out -> gone.
  useEffect(() => {
    if (phase === 'text-out') {
      const id = window.setTimeout(() => setPhase('overlay-out'), TEXT_OUT_MS + POST_TEXT_HOLD_MS)

      return () => window.clearTimeout(id)
    }

    if (phase === 'overlay-out') {
      const id = window.setTimeout(() => setPhase('gone'), OVERLAY_OUT_MS)

      return () => window.clearTimeout(id)
    }

    // Preview replays so we can keep watching the transition.
    if (phase === 'gone' && previewing) {
      const id = window.setTimeout(() => setPhase('live'), PREVIEW_REPLAY_MS)

      return () => window.clearTimeout(id)
    }
  }, [phase, previewing])

  // Boot failed — BootFailureOverlay owns the screen; don't linger behind it.
  if (boot.error && !previewing) {
    return null
  }

  // Real connect: once the fade finishes, get out of the way for good.
  if (phase === 'gone' && !previewing) {
    return null
  }

  // Never showed (e.g. gateway already up on a warm reload) — stay out.
  if (!previewing && !connecting && !shownRef.current) {
    return null
  }

  return (
    <ConnectingOverlayView decoding={phase === 'live' && (previewing || connecting)} onExit={onExit} phase={phase} />
  )
}
