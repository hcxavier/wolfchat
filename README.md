# 🐺 WolfChat

Um assistente de chat com IA moderno e elegante, construído com React, TypeScript e Vite.

## ✨ Funcionalidades

- 💬 **Chat com IA** - Converse com modelos de IA de diferentes provedores
- 🌊 **Streaming em tempo real** - Veja as respostas da IA sendo geradas em tempo real
- 🎨 **Modo Imersivo** - Formatação rica com tags customizadas (títulos, avisos, citações, terminais)
- 💾 **Persistência Local** - Histórico de conversas salvo no IndexedDB
- 🔍 **Busca** - Pesquise no histórico de chats e dentro das conversas
- ⚙️ **Configurável** - Suporte a múltiplos provedores de IA (OpenRouter, Groq, Gemini)
- 📱 **Responsivo** - Interface adaptada para desktop e mobile
- ✨ **Animações** - Transições suaves com Framer Motion

## 🛠️ Tecnologias

- **React 18** - Biblioteca de UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Estilização utilitária
- **Dexie** - Wrapper para IndexedDB
- **Framer Motion** - Animações
- **React Markdown** - Renderização de markdown
- **React Syntax Highlighter** - Destaque de sintaxe para blocos de código

## 🚀 Como Executar

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build
```

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── atoms/       # Componentes básicos (botões, ícones, etc)
│   ├── molecules/   # Componentes compostos (input de chat, items, etc)
│   └── organisms/   # Componentes complexos (sidebar, chat area, etc)
├── hooks/           # Custom hooks (useChat, useSettings)
├── services/        # Serviços de API
├── db/              # Configuração do IndexedDB
├── types/           # Tipos TypeScript
└── utils/           # Funções utilitárias
```

## ⚙️ Configuração

1. Abra as configurações no app (ícone de engrenagem)
2. Adicione suas chaves de API:
   - **OpenRouter**: Para modelos como Claude, GPT, etc
   - **Groq**: Para modelos Llama com baixa latência
   - **Gemini**: Para modelos do Google
