// health: allow FILE_LINES -- Portuguese locale data
import { defineLocale, type TranslationOverrides } from './define-locale'
import { introPt } from './intro-pt'

export const ptOverrides = {
  gatewayGroupOpen: {
    opening: 'Abrindo o chat em grupo…',
    lookupFailed: 'Não foi possível encontrar este grupo no gateway. Tente novamente.',
    missing: 'Este chat em grupo não existe mais.'
  },
  intro: introPt,
  common: {
    apply: 'Aplicar',
    back: 'Voltar',
    save: 'Salvar',
    saving: 'Salvando…',
    cancel: 'Cancelar',
    close: 'Fechar',
    confirm: 'Confirmar',
    delete: 'Excluir',
    refresh: 'Atualizar',
    retry: 'Tentar novamente',
    search: 'Pesquisar…',
    loading: 'Carregando…',
    create: 'Criar',
    edit: 'Editar',
    done: 'Concluído',
    remove: 'Remover',
    reset: 'Redefinir',
    copy: 'Copiar',
    copied: 'Copiado',
    dismiss: 'Dispensar',
    more: 'Mais',
    less: 'Menos',
    on: 'Ativado',
    off: 'Desativado',
    all: 'Todos',
    none: 'Nenhum',
    open: 'Abrir',
    clear: 'Limpar',
    default: 'Padrão',
    active: 'Ativo',
    inactive: 'Inativo',
    enabled: 'ativado',
    disabled: 'desativado',
    unknown: 'desconhecido',
    untitled: 'Sem título'
  },
  language: {
    label: 'Idioma',
    description: 'Escolha o idioma da interface desktop.',
    saving: 'Salvando idioma…',
    saveError: 'Falha ao atualizar o idioma',
    switchTo: 'Mudar idioma',
    searchPlaceholder: 'Pesquisar idiomas…',
    noResults: 'Nenhum idioma encontrado'
  },
  settings: {
    closeSettings: 'Fechar configurações',
    exportConfig: 'Exportar configuração',
    importConfig: 'Importar configuração',
    resetToDefaults: 'Redefinir para os padrões',
    resetConfirm: 'Redefinir todas as configurações para os padrões do RUBIMIND?',
    exportFailed: 'Falha ao exportar',
    resetFailed: 'Falha ao redefinir',
    subpages: {
      appearanceTheme: 'Tema',
      appearanceTypography: 'Tipografia',
      appearanceWindowLayout: 'Janela e layout',
      appearanceChatDisplay: 'Exibição do chat',
      appearancePet: 'Pet',
      appearanceGeneral: 'Geral',
      modelMain: 'Modelo principal',
      modelAuxiliary: 'Modelos auxiliares',
      modelMoa: 'Mistura de Agentes (MoA)',
      modelFallbacks: 'Modelos de fallback',
      chatBehavior: 'Comportamento',
      chatAttachments: 'Anexos',
      workspaceProjects: 'Projetos e descoberta',
      workspaceShell: 'Ambiente de shell',
      workspaceFiles: 'Arquivos e execução',
      safetyApprovals: 'Aprovações',
      safetyPrivacy: 'Privacidade e rede',
      safetyCheckpoints: 'Pontos de restauração',
      browserProfile: 'Perfil do navegador',
      browserNetwork: 'URLs locais e privadas',
      memoryPersistent: 'Memória persistente',
      memoryContext: 'Contexto e compressão',
      voiceConversation: 'Conversação por voz',
      voiceTranscription: 'Voz para texto',
      voiceSpeech: 'Texto para voz',
      advancedRuntime: 'Limites do agente',
      advancedTools: 'Acesso a ferramentas',
      advancedTerminal: 'Backend do terminal',
      advancedOutput: 'Limites de saída',
      advancedDelegation: 'Subagentes',
      advancedDesktop: 'Desktop e inicialização',
      gatewayConnection: 'Gateway primário',
      gatewayDevices: 'Conexões salvas',
      gatewayManagedUpdates: 'Atualizações remotas',
      gatewayManagedUpdatesUnavailable:
        'Atualizações remotas exigem uma versão desktop com suporte a atualizações SSH gerenciadas.',
      gatewayManagedUpdatesEmpty:
        'Adicione uma conexão SSH em Conexões salvas para gerenciar suas atualizações aqui.',
      keyboardShortcuts: 'Atalhos de teclado',
      hudGesture: 'Gesto HUD',
      screenCapture: 'Captura de tela',
      notificationAlerts: 'Alertas no desktop',
      notificationSounds: 'Sons',
      archivedSessions: 'Arquivo e retenção',
      defaultDirectory: 'Pasta padrão de projetos',
      vaultCredentials: 'Credenciais salvas',
      vaultSources: 'Gerenciadores de senhas',
      appUpdates: 'Versão e atualizações',
      uninstall: 'Desinstalar',
      billingOverview: 'Visão geral',
      billingPlans: 'Planos'
    }
  },
  sidebar: {
    newSession: 'Nova sessão',
    searchPlaceholder: 'Pesquisar sessões…',
    pinned: 'Fixadas',
    sessions: 'Sessões',
    empty: 'Nenhuma sessão encontrada',
    collapse: 'Recolher barra lateral',
    expand: 'Expandir barra lateral'
  },
  composer: {
    placeholder: 'Envie uma mensagem ou comando…',
    send: 'Enviar mensagem',
    stop: 'Parar execução',
    attach: 'Anexar arquivo',
    voice: 'Conversa por voz'
  },
  desktop: {
    quit: 'Sair do RUBIMIND',
    minimize: 'Minimizar',
    maximize: 'Maximizar',
    restore: 'Restaurar',
    close: 'Fechar',
    reload: 'Recarregar',
    toggleDevTools: 'Ferramentas de desenvolvedor'
  },
  boot: {
    ready: 'RUBIMIND Desktop está pronto',
    desktopBootFailedWithMessage: (message: string) => `Falha na inicialização do Desktop: ${message}`,
    steps: {
      connectingGateway: 'Conectando ao gateway do desktop',
      loadingSettings: 'Carregando configurações do RUBIMIND',
      loadingSessions: 'Carregando sessões recentes',
      retryingRemoteBackend: 'Reconectando ao backend remoto do RUBIMIND…',
      startingDesktopConnection: 'Iniciando conexão do desktop',
      startingRUBIMINDDesktop: 'Iniciando RUBIMIND Desktop…'
    },
    errors: {
      backgroundExited:
        'O serviço que executa seus chats foi encerrado inesperadamente. Reinicie-o para continuar — seus chats e configurações estão salvos.',
      backgroundExitedDuringStartup: 'RUBIMIND parou logo após iniciar.',
      backendStopped: 'RUBIMIND parou de funcionar em segundo plano',
      restartRUBIMIND: 'Reiniciar RUBIMIND',
      openLogs: 'Abrir logs',
      desktopBootFailed: 'Não foi possível iniciar o RUBIMIND',
      gatewayConnectionLost: 'RUBIMIND perdeu a conexão',
      gatewayConnectionLostDetail:
        'Ainda tentando reconectar. Você pode continuar lendo e digitando.',
      reconnectNow: 'Reconectar agora',
      connectionSettings: 'Configurações de conexão',
      gatewaySignInRequired: 'Seu RUBIMIND remoto encerrou a sessão',
      gatewaySignInRequiredDetail: 'Faça login novamente para reconectar. Seus chats estão seguros.',
      signInAgain: 'Entrar novamente',
      ipcBridgeUnavailable: 'O RUBIMIND Desktop não conseguiu se comunicar com seu serviço em segundo plano.'
    },
    causes: {
      exitedEarly: 'O serviço em segundo plano do RUBIMIND parou logo após iniciar.',
      timedOut: 'O serviço em segundo plano do RUBIMIND não respondeu a tempo.',
      permission: 'O RUBIMIND não pôde gravar na pasta de dados (permissão negada).',
      diskFull: 'O disco está cheio, portanto o RUBIMIND não pôde iniciar.',
      portInUse: 'Outro programa está usando a porta de rede necessária para o RUBIMIND.',
      installMissing: 'Parte da instalação do RUBIMIND está ausente. Escolha Reparar instalação.'
    },
    failure: {
      title: 'Não foi possível iniciar o RUBIMIND',
      description:
        'O serviço em segundo plano do RUBIMIND não subiu. Tente uma das opções de recuperação abaixo. Nada aqui apaga seus chats ou configurações.',
      details: 'Detalhes',
      remoteTitle: 'Login no gateway remoto necessário',
      remoteDescription: 'Conecte-se novamente ao gateway remoto para continuar.',
      webappTitle: 'Falha na conexão webapp',
      webappDescription: 'Não foi possível se conectar à interface webapp.',
      retry: 'Tentar novamente',
      repairInstall: 'Reparar instalação',
      useLocalGateway: 'Usar gateway local',
      gatewaySettings: 'Configurações do gateway',
      back: 'Voltar',
      openLogs: 'Abrir logs'
    }
  },
  ui: {
    search: {
      clear: 'Limpar pesquisa'
    },
    logs: {
      bottom: 'Ir para o final',
      search: 'Pesquisar logs…',
      top: 'Ir para o início'
    },
    pagination: {
      label: 'paginação',
      previous: 'Anterior',
      previousAria: 'Ir para a página anterior',
      next: 'Próximo',
      nextAria: 'Ir para a próxima página'
    },
    sidebar: {
      title: 'Barra lateral',
      description: 'Alternar barra lateral',
      toggle: (open: boolean) => `${open ? 'Ocultar' : 'Mostrar'} barra lateral`
    }
  },
  onboarding: {
    featuredPitch: 'Conecte sua chave de API RUBIMIND (RBM-API-...) para desbloquear os modelos nativos Omni e Core.',
    recommended: 'Recomendado',
    freeTier: 'Gratuito',
    connected: 'Conectado',
    otherProviders: 'Outros provedores',
    collapse: 'Recolher',
    haveApiKey: 'Já tem uma chave de API?'
  },
  freeTier: {
    providerRowTitle: 'RUBIMIND AI',
    providerRowPitch: 'Conecte sua chave de API RUBIMIND (RBM-API-...) para desbloquear os modelos nativos Omni e Core.',
    readyTitle: 'RUBIMIND está pronto.',
    readyCaption: 'Gratuito · conectores incluídos',
    begin: 'Começar',
    signInInstead: 'Conectar com chave em vez disso',
    otherProviders: 'Outros provedores',
    stripTitle: 'Inferência e conectores RUBIMIND estão disponíveis.',
    stripBody: 'Abra o seletor de modelos para usá-los ou conecte sua chave de API.',
    openModelPicker: 'Abrir seletor de modelos',
    dismiss: 'Dispensar',
    providerName: 'RUBIMIND',
    statusLabel: (model: string) => `RUBIMIND · ${model}`,
    signIn: 'Conectar',
    signInHeading: 'Conecte sua chave de API RUBIMIND para desbloquear mais modelos e ferramentas.',
    settingUp: 'Configurando inferência…',
    finishInBrowser: 'Concluir no navegador',
    doNotShare: 'Não compartilhe sua chave.',
    openPageAgain: 'Abrir página novamente',
    waiting: 'Aguardando conexão…'
  },
  updates: {
    versionDetailsDistribution: 'Distribuição',
    versionDetailsDistributionDesktop: 'Aplicativo Desktop',
    versionDetailsDistributionDesktopInstaller: 'Aplicativo Desktop (instalador)',
    versionDetailsDistributionSource: 'Código-fonte',
    versionDetailsDistributionSourceInstaller: 'Código-fonte (script de instalação)',
    versionDetailsDistributionSourceDesktop: 'Código-fonte + RUBIMIND Desktop',
    versionDetailsDistributionSourceInstallerDesktop: 'Código-fonte (script de instalação) + RUBIMIND Desktop',
    versionDetailsInstallId: 'ID de instalação'
  }
} satisfies TranslationOverrides

export const pt = defineLocale(ptOverrides)
