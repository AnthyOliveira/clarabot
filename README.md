# WhatsApp Bot com OpenRouter API

Este é um bot para WhatsApp que utiliza a biblioteca Baileys para conectar-se ao WhatsApp Web e redireciona todas as mensagens recebidas para a API do OpenRouter, retornando as respostas automaticamente.

## Características

- ✅ Conexão persistente com WhatsApp (não precisa escanear QR Code toda vez)
- ✅ Redirecionamento automático de mensagens para OpenRouter API
- ✅ Resposta automática para o remetente original
- ✅ Tratamento de erros e reconexão automática
- ✅ Configuração via arquivo JSON
- ✅ Logs detalhados para monitoramento

## Pré-requisitos

- Node.js 16 ou superior
- Uma conta no OpenRouter com chave de API
- Um número de telefone com WhatsApp para usar como bot

## Instalação

1. Clone ou baixe este projeto
2. Instale as dependências:

```bash
npm install
```

## Configuração

1. Edite o arquivo `config.json` e configure sua chave da API do OpenRouter:

```json
{
  "openrouter": {
    "apiKey": "SUA_CHAVE_OPENROUTER_AQUI",
    "baseUrl": "https://openrouter.ai/api/v1",
    "model": "openai/gpt-3.5-turbo"
  },
  "whatsapp": {
    "sessionPath": "./session",
    "printQRInTerminal": true
  }
}
```

### Configurações disponíveis:

- `openrouter.apiKey`: Sua chave de API do OpenRouter
- `openrouter.baseUrl`: URL base da API (normalmente não precisa alterar)
- `openrouter.model`: Modelo de IA a ser usado (ex: "openai/gpt-3.5-turbo", "anthropic/claude-3-haiku")
- `whatsapp.sessionPath`: Diretório onde os dados de sessão serão salvos
- `whatsapp.printQRInTerminal`: Se deve exibir o QR Code no terminal

## Como usar

1. Execute o bot:

```bash
npm start
```

2. Na primeira execução, um QR Code será exibido no terminal
3. Escaneie o QR Code com seu WhatsApp (Configurações > Dispositivos conectados > Conectar um dispositivo)
4. Aguarde a mensagem "✅ Conectado ao WhatsApp!"
5. Agora o bot está ativo e responderá automaticamente a todas as mensagens recebidas

## Como funciona

1. O bot recebe uma mensagem no WhatsApp
2. Extrai o texto da mensagem
3. Envia o texto para a API do OpenRouter
4. Recebe a resposta da IA
5. Envia a resposta de volta para o remetente original

## Estrutura do projeto

```
whatsapp-bot/
├── index.js          # Arquivo principal do bot
├── config.json       # Configurações do bot
├── package.json      # Dependências e scripts
├── session/          # Dados de sessão do WhatsApp (criado automaticamente)
└── README.md         # Esta documentação
```

## Logs e monitoramento

O bot exibe logs detalhados no console:

- 🚀 Mensagens de inicialização
- 📱 Status do QR Code
- ✅ Confirmação de conexão
- 📨 Mensagens recebidas
- ✅ Respostas enviadas
- ❌ Erros e problemas
- 🔄 Tentativas de reconexão

## Solução de problemas

### Bot não conecta
- Verifique se o QR Code foi escaneado corretamente
- Certifique-se de que o WhatsApp está funcionando no seu celular
- Tente deletar a pasta `session` e reconectar

### Erro de API
- Verifique se a chave do OpenRouter está correta
- Confirme se há créditos na sua conta OpenRouter
- Teste a chave diretamente na documentação do OpenRouter

### Bot para de responder
- Verifique os logs para identificar erros
- O bot tentará reconectar automaticamente
- Se necessário, reinicie o processo

## Parando o bot

Para parar o bot de forma segura, use `Ctrl+C` no terminal. O bot desconectará adequadamente do WhatsApp antes de encerrar.

## Segurança

- Mantenha sua chave de API segura e não a compartilhe
- Os dados de sessão ficam salvos localmente na pasta `session`
- Não execute o bot em servidores públicos sem as devidas precauções

## Suporte

Este bot foi criado usando:
- [Baileys](https://github.com/WhiskeySockets/Baileys) - Biblioteca para WhatsApp Web
- [OpenRouter](https://openrouter.ai/) - API para modelos de IA
- [Axios](https://axios-http.com/) - Cliente HTTP para Node.js

