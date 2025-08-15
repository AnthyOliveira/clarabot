# WhatsApp Bot

Este é um bot inteligente para WhatsApp construído com Node.js, TypeScript e WPPConnect, integrando-se com Twitch API, OpenWeather API e OpenRouter API para respostas com IA.

## Funcionalidades

- Integração com Twitch API para avisar quando um streamer fica online.
- Integração com OpenWeather API para clima e previsão.
- Integração com OpenRouter API para respostas com IA.
- Sistema de comandos via WhatsApp.
- Webhook para envio de mensagens externas.
- Autenticação por token para webhooks.
- Log estruturado.

## Estrutura do Projeto

```
src/
├── app.ts
├── server.ts
├── config/
│   ├── env.ts
│   ├── wppconnect.config.ts
│   ├── twitch.config.ts
│   ├── weather.config.ts
│   └── openrouter.config.ts
├── services/
│   ├── message.service.ts
│   ├── twitch.service.ts
│   ├── weather.service.ts
│   └── ai.service.ts
├── controllers/
│   └── message.controller.ts
├── routes/
│   └── webhook.routes.ts
├── middlewares/
│   ├── auth.middleware.ts
│   └── error.middleware.ts
├── utils/
│   └── logger.ts
├── storage/sessions/       # Persistência de sessões do WhatsApp
└── index.ts                # Entry point
```

## Configuração

1.  **Variáveis de Ambiente:**

    Crie um arquivo `.env` na raiz do projeto, baseado no `.env.example`, e preencha com suas chaves de API:

    ```
    PORT=3000
    WPPCONNECT_SESSION_NAME=bot-session
    TWITCH_CLIENT_ID=SUA_TWITCH_CLIENT_ID
    TWITCH_CLIENT_SECRET=SUA_TWITCH_CLIENT_SECRET
    OPENWEATHER_API_KEY=SUA_OPENWEATHER_API_KEY
    OPENROUTER_API_KEY=SUA_OPENROUTER_API_KEY
    OPENROUTER_MODEL=mistralai/mistral-7b-instruct # Ou outro modelo compatível
    WEBHOOK_SECRET=sua_chave_secreta_para_webhooks
    ```

2.  **Instalação de Dependências:**

    ```bash
    npm install
    ```

## Execução

1.  **Compilar o Projeto:**

    ```bash
    npm run build
    ```

2.  **Iniciar o Bot:**

    ```bash
    npm start
    ```

    Ao iniciar, o bot tentará conectar-se ao WhatsApp. Um QR Code será exibido no console para que você possa escaneá-lo com seu celular e conectar a sessão.

## Comandos do Bot (via WhatsApp)

-   `/twitch <nome_streamer>`: Verifica o status de um streamer na Twitch.
    Ex: `/twitch alanzoka`

-   `/clima <cidade>`: Obtém o clima atual de uma cidade.
    Ex: `/clima São Paulo`

-   `/previsao <cidade>`: Obtém a previsão do tempo para uma cidade.
    Ex: `/previsao Rio de Janeiro`

-   `/ia <mensagem>`: Gera uma resposta inteligente usando a OpenRouter API.
    Ex: `/ia qual a capital do Brasil?`

## Webhook para Envio de Mensagens

Você pode enviar mensagens para o bot via um webhook POST para `http://localhost:3000/webhook/send-message` (ou a URL do seu servidor).

**Método:** `POST`
**URL:** `/webhook/send-message`
**Headers:**

-   `Authorization: Bearer <WEBHOOK_SECRET>` (substitua `<WEBHOOK_SECRET>` pela chave definida no seu `.env`)

**Body (JSON):**

```json
{
  "to": "5511999999999@c.us",
  "message": "Olá do meu webhook!"
}
```

Substitua `5511999999999@c.us` pelo número de telefone do destinatário no formato `código_paísDDDnúmero@c.us`.

## Observações

-   Certifique-se de que as portas necessárias (padrão 3000) estejam abertas no seu firewall, se aplicável.
-   O WPPConnect requer um navegador Chromium. Ele tentará baixá-lo automaticamente, mas pode ser necessário instalar dependências adicionais do sistema operacional (como `libgconf-2-4`, `libatk-bridge2.0-0`, `libgtk-3-0`, etc., dependendo da sua distribuição Linux).




## Gerenciamento de Sessões WPPConnect (via API)

Você pode gerenciar as sessões do WPPConnect através das seguintes rotas:

-   **Iniciar Sessão:**
    -   **Método:** `POST`
    -   **URL:** `/session/start`
    -   **Descrição:** Tenta iniciar uma nova sessão do WPPConnect. Um QR Code será exibido no console se necessário.

-   **Obter Status da Sessão:**
    -   **Método:** `GET`
    -   **URL:** `/session/status`
    -   **Descrição:** Retorna o status atual da sessão do WPPConnect (conectado/desconectado).

-   **Encerrar Sessão:**
    -   **Método:** `POST`
    -   **URL:** `/session/close`
    -   **Descrição:** Encerra a sessão atual do WPPConnect.

## Fila de Atendimento

O bot agora possui um sistema de fila de atendimento simples. Mensagens que não são comandos diretos (`/twitch`, `/clima`, `/previsao`, `/ia`) são adicionadas a uma fila e processadas sequencialmente. Isso evita sobrecarga e permite um gerenciamento mais organizado das interações.


