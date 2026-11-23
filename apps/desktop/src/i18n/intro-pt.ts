import type { Translations } from './types'

/** Display-only translations, in the stock JSONL's per-personality rotation order. */
export const introPt: Translations['intro'] = {
  stock: {
    helpful: [
      'Peça-me para abrir um repositório, executar testes, corrigir um bug ou criar um PR. Eu guio você passo a passo.',
      'Aponte um arquivo, cole um erro ou descreva o que você está construindo. Eu assumo a partir daí.',
      'Experimente: revise meu diff, execute a suíte de testes ou explique esta função. Pergunte o que quiser sobre seu código.',
      'Posso editar arquivos, executar comandos, pesquisar na web e resolver bugs difíceis. Apenas descreva a tarefa.',
      'Compartilhe o caminho de um repositório ou uma pergunta para começar. Respondo com clareza e ligo os arquivos que altero.'
    ],
    concise: [
      'Descreva a tarefa. Eu executo.',
      'Cole código, erros ou um objetivo. Respostas curtas, mudanças rápidas.',
      'Pergunte. Leio arquivos, executo testes, entrego patches. Sem enrolação.',
      'Uma linha basta. Só me estendo quando importa.',
      'Comando, pergunta ou caminho de arquivo. Eu cuido do resto.'
    ],
    technical: [
      'Indique o repositório, o teste com falha ou o stack trace. Ferramentas: fs, git, exec, search, patch, http.',
      'Envie um prompt para disparar chamadas de ferramentas. Suporta edições em vários arquivos, testes, git e web.',
      'Defina a tarefa. Planejo, chamo ferramentas e verifico a saída. Diffs exibidos antes de aplicar.',
      'Aceita linguagem natural ou comandos estruturados. Ciclo: ler -> planejar -> aplicar patch -> testar -> relatar.',
      'Sistema de arquivos, terminal, git, navegador e pesquisa. Descreva a alteração; entrego diffs e testes.'
    ],
    creative: [
      'O que vamos construir? Cole uma ideia, função quebrada ou projeto. Vou dar vida a isso.',
      'Dê uma faísca — uma função, refatoração ou protótipo ousado — e transformarei em código funcional.',
      'Descreva o que ainda não existe. Reunirei testes, arquivos e APIs em uma versão pronta.',
      'Traga a intenção, não a especificação. Prototipamos rápido, refinamos depois.',
      'Diga o que você busca. Adapto exemplos, conecto componentes e entrego commits limpos.'
    ],
    teacher: [
      'Pergunte sobre qualquer arquivo, conceito ou erro. Explico o porquê com exemplos práticos.',
      'Cole código para revisar, bug para depurar ou arquitetura para entender. Guio passo a passo.',
      'Compartilhe o desafio. Divido em partes e ensino o princípio para você dominar o próximo.',
      'Lemos o código juntos, encontramos a causa raiz e construímos um modelo mental sólido.',
      'Diga o tema ou cole o trecho. Explicações claras, diagramas em texto e código de exemplo.'
    ],
    kawaii: [
      'cole um bug ou arquivo e vou arrumar com todo o cuidado! testes, diffs e carinho extra! *brilhos*',
      'me conta o que você está criando! adoro refatorações e repositórios grandes (>w<)',
      'mande um erro ou objetivo. vou organizar com commits super limpinhos!',
      'uma tarefa de cada vez, bem feita! posso rodar testes e deixar seu repo impecável <3',
      'mande um oi ou um erro! nenhuma tarefa é pequena demais. vamos resolver juntinhos!'
    ],
    catgirl: [
      'aponta o arquivo ou me joga o repositório. pulo nos testes que falharem com diffs afiados, nyan~',
      'descreva a tarefa. arrumo, testo e entrego seu PR impecável!',
      'mande o bug! caço os erros e deixo tudo funcionando perfeitamente, purr~',
      'um comando e eu entro em ação! garras afiadas contra código quebrado.',
      'pronta para codar com você! mostre o repo e vamos ao trabalho, nya~'
    ]
  },
  custom: () => []
}
