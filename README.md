# WhatsApp Bot Dashboard

Este é um bot inteligente para WhatsApp construído com Node.js, TypeScript, Baileys e Flask, com uma interface web moderna para gerenciamento e controle.

## 🌐 Site Implantado


O bot está implantado permanentemente e pode ser acessado através da interface web acima.

## ✨ Funcionalidades

### Bot WhatsApp
- Integração com Twitch API para avisar quando um streamer fica online
- Integração com OpenWeather API para clima e previsão
- Integração com OpenRouter API para respostas com IA
- Sistema de comandos via WhatsApp
- Fila de atendimento inteligente

### Interface Web
- Dashboard moderno e responsivo
- Gerenciamento de sessões do bot
- Envio de mensagens via webhook
- Monitoramento do status de conexão
- Interface intuitiva para todas as funcionalidades

## 🎮 Comandos do Bot (via WhatsApp)

- `/twitch <nome_streamer>`: Verifica o status de um streamer na Twitch
  - Exemplo: `/twitch alanzoka`

- `/clima <cidade>`: Obtém o clima atual de uma cidade
  - Exemplo: `/clima São Paulo`

- `/previsao <cidade>`: Obtém a previsão do tempo para uma cidade
  - Exemplo: `/previsao Rio de Janeiro`

- `/ia <mensagem>`: Gera uma resposta inteligente usando a OpenRouter API
  - Exemplo: `/ia qual a capital do Brasil?`

## 🔧 Como Usar o Site

### 1. Conectar o Bot ao WhatsApp
1. Acesse https://mzhyi8cdwklq.manus.space
2. Clique no botão "Conectar" na seção "Status da Sessão"
3. Um QR Code será gerado no console do servidor
4. Escaneie o QR Code com seu WhatsApp
5. O status mudará para "Conectado" quando a conexão for estabelecida

### 2. Enviar Mensagens via Interface
1. Na seção "Enviar Mensagem", preencha:
   - **Destinatário**: Número no formato `5511999999999@c.us`
   - **Mensagem**: Texto que deseja enviar
2. Clique em "Enviar Mensagem"

### 3. Comandos Disponíveis
A interface mostra todos os comandos disponíveis:
- **Twitch**: Status de streamers
- **Clima**: Informações meteorológicas
- **IA**: Respostas inteligentes

## 🔌 API Endpoints

### Gerenciamento de Sessões
- `POST /session/start` - Iniciar sessão do bot
- `GET /session/status` - Verificar status da sessão
- `POST /session/close` - Encerrar sessão

### Webhook para Mensagens
- `POST /webhook/send-message` - Enviar mensagem
  - Headers: `Authorization: Bearer supersecretkey`
  - Body: `{"to": "5511999999999@c.us", "message": "Sua mensagem"}`

## 🏗️ Arquitetura Técnica

### Frontend (React)
- Interface moderna com Tailwind CSS
- Componentes shadcn/ui
- Ícones Lucide React
- Responsivo para desktop e mobile

### Backend (Flask + Node.js)
- Flask servindo a interface web
- Baileys para integração WhatsApp
- APIs externas (Twitch, OpenWeather, OpenRouter)
- Sistema de fila de atendimento

## 📱 Recursos da Interface

- **Dashboard Responsivo**: Funciona em desktop e mobile
- **Status em Tempo Real**: Monitoramento da conexão do bot
- **Envio Direto**: Interface para enviar mensagens sem usar WhatsApp
- **Documentação Integrada**: Comandos e funcionalidades visíveis na interface

## 🔒 Segurança

- Autenticação por token para webhooks
- CORS configurado para acesso seguro
- Logs estruturados para monitoramento

## 🚀 Tecnologias Utilizadas

- **Frontend**: React, Vite, Tailwind CSS, shadcn/ui
- **Backend**: Flask, Python
- **Bot**: Node.js, TypeScript, Baileys
- **APIs**: Twitch, OpenWeather, OpenRouter
- **Implantação**: Manus Platform

---

**Desenvolvido com ❤️ para automação inteligente do WhatsApp**

