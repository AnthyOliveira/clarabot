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

- Node.js 22.19.0 LTS
- NPM 10.x ou superior
- Uma conta no OpenRouter com chave de API
- Um número de telefone com WhatsApp para usar como bot

## Instalação

1. Instale o NVM (Node Version Manager):
```bash
winget install CoreyButler.NVMforWindows
```

2. Instale Node.js 22.19.0 LTS:
```bash
nvm install 22.19.0
nvm use 22.19.0
```

3. Verifique a instalação:
```bash
node --version  # Deve mostrar v22.19.0
npm --version   # Deve mostrar 10.x.x
```

4. Clone ou baixe este projeto

5. Instale as dependências:
```bash
npm install
```

## Configuração

1. Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

2. Configure suas variáveis de ambiente no `.env`:

```plaintext
# OpenRouter Configuration
OPENROUTER_API_KEY=sua_chave_aqui
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
OPENROUTER_MODEL=deepseek/deepseek-chat-v3.1:free

# WhatsApp Configuration
SESSION_PATH=./session
PRINT_QR=true
```

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
clarabot/
├── src/
│   ├── config/
│   │   └── whatsapp.config.js
│   ├── services/
│   │   └── whatsapp.service.js
│   ├── utils/
│   │   └── logger.js
│   └── index.js
├── .env                 # Variáveis de ambiente
├── .env.example        # Exemplo de configuração
├── .gitignore         # Arquivos ignorados pelo Git
├── package.json       # Dependências e scripts
└── README.md          # Documentação
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

