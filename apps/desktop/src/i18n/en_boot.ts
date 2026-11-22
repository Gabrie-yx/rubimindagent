import type { Translations } from './types'

// The boot screen's copy (including the update-hold screen), composed by en.ts.
export const enBoot = {
  boot: {
    ready: 'RUBIMIND Desktop is ready',
    desktopBootFailedWithMessage: message => `Desktop boot failed: ${message}`,
    steps: {
      connectingGateway: 'Connecting live desktop gateway',
      loadingSettings: 'Loading RUBIMIND settings',
      loadingSessions: 'Loading recent sessions',
      retryingRemoteBackend: 'Reconnecting to the remote RUBIMIND backend…',
      startingDesktopConnection: 'Starting desktop connection',
      startingRUBIMINDDesktop: 'Starting RUBIMIND Desktop…'
    },
    errors: {
      backgroundExited:
        'The service that runs your chats closed unexpectedly. Restart it to keep going — your chats and settings are safe.',
      backgroundExitedDuringStartup: 'RUBIMIND stopped right after it started.',
      backendStopped: 'RUBIMIND stopped working in the background',
      restartRUBIMIND: 'Restart RUBIMIND',
      openLogs: 'Open logs',
      desktopBootFailed: "RUBIMIND couldn't start",
      gatewayConnectionLost: 'RUBIMIND lost its connection',
      gatewayConnectionLostDetail:
        'Still trying to reconnect. You can keep reading and drafting. If this keeps up, reconnect now or check your connection settings.',
      reconnectNow: 'Reconnect now',
      connectionSettings: 'Connection settings',
      gatewaySignInRequired: 'Your remote RUBIMIND signed you out',
      gatewaySignInRequiredDetail: 'Sign in again to reconnect. Your chats and settings are safe.',
      signInAgain: 'Sign in again',
      ipcBridgeUnavailable: "RUBIMIND Desktop couldn't talk to its own background layer. Restart the app."
    },
    // Plain causes for a local backend boot failure (`classifyBootFailure`);
    // the raw output stays behind "Show recent logs".
    causes: {
      exitedEarly: "RUBIMIND' background service stopped right after starting.",
      timedOut: "RUBIMIND' background service didn't answer in time.",
      permission: "RUBIMIND couldn't write to its data folder (permission problem).",
      diskFull: 'The disk is full, so RUBIMIND could not start.',
      portInUse: 'Another program is using the network port RUBIMIND needs.',
      installMissing: "Part of RUBIMIND' installation is missing. Choose Repair install to put it back."
    },
    failure: {
      title: "RUBIMIND couldn't start",
      description:
        "RUBIMIND' background service didn't come up. Try one of the recovery steps below. Nothing here deletes your chats or settings.",
      details: 'Details',
      remoteTitle: 'Remote gateway sign-in required',
      remoteDescription:
        'Your remote gateway session has expired. Sign in again to reconnect. Nothing here deletes your chats or settings.',
      webappTitle: 'Sign in to RUBIMIND',
      webappDescription: 'Run hermes webapp on this computer to sign this browser in.',
      retry: 'Retry',
      repairInstall: 'Repair install',
      useLocalGateway: 'Use local gateway',
      gatewaySettings: 'Gateway settings',
      back: 'Back',
      openLogs: 'Open logs',
      repairHint: 'Repair re-runs the installer and can take a few minutes on a fresh machine.',
      bundledReinstallHint:
        'This bundled install can’t repair itself from inside the app — reinstall the app to restore its backend.',
      reinstallApp: 'Reinstall the app',
      remoteSignInHint: signInLabel =>
        `Signs out of the saved remote browser session, then opens ${signInLabel}. Use local gateway to switch to the bundled backend instead.`,
      signOutAndSignIn: 'Sign out & sign in',
      remoteFailureHint: 'Check the gateway URL and sign-in under Gateway settings, or switch to the local gateway.',
      cloudDownTitle: 'Nous Cloud agent is down',
      cloudDownDescription:
        'The Nous-managed cloud agent this gateway connects to is returning a server error. It cannot be restarted from here — check its status, switch to the local gateway, or get support.',
      cloudDownHint:
        'The buttons below open the Nous Portal (instance status and controls) and our Discord for support.',
      cloudDownCheckPortal: 'Check Portal status',
      cloudDownDiscord: 'Get help on Discord',
      hideRecentLogs: 'Hide recent logs',
      showRecentLogs: 'Show recent logs',
      signedInTitle: 'Signed in',
      signedInMessage: 'Reconnecting to the remote gateway…',
      signInIncompleteTitle: 'Sign-in incomplete',
      signInIncompleteMessage: 'The login window closed before authentication finished.',
      signInFailed: 'Sign-in failed',
      signInToRemoteGateway: 'Sign in to remote gateway',
      signInWithProvider: provider => `Sign in with ${provider}`,
      identityProvider: 'your identity provider'
    },
    updateHold: {
      title: 'An earlier update still holds RUBIMIND',
      titleUnverified: "RUBIMIND can't confirm the last update finished",
      description:
        "RUBIMIND is holding off on starting so it can't load files an update may still be changing. It starts by itself as soon as the hold ends.",
      heldByProcess: pid =>
        `The update (process ${pid}) exited, but a process it started still holds the RUBIMIND install.`,
      heldUnknown: 'An update exited, but a process it started still holds the RUBIMIND install.',
      unverified: "The update helper couldn't check who owns the RUBIMIND install right now. RUBIMIND keeps checking.",
      since: time => `Waiting since ${time}`,
      lastChecked: time => `Last checked ${time}`,
      recoveryHint:
        'This usually clears in a few minutes. If it does not: quit RUBIMIND, end leftover git or hermes processes (or restart the computer), then open RUBIMIND again.',
      checkAgain: 'Check again',
      quit: 'Quit RUBIMIND',
      openLogs: 'Open logs',
      startAnyway: 'Start anyway…',
      confirmTitle: 'Start RUBIMIND while the update still holds it?',
      confirmBody:
        "The leftover update process may still be changing RUBIMIND' files. Starting now can load a half-updated install, which may not work until you run the update again. RUBIMIND records this choice in its log and leaves the update marker in place.",
      confirmKeepWaiting: 'Keep waiting',
      confirmStart: 'Start anyway',
      startAnywayRefused: 'What holds the install changed before RUBIMIND could start. Review it and try again.'
    }
  }
} satisfies Pick<Translations, 'boot'>
