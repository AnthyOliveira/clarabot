const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const dotenv = require('dotenv');
const Session = require('./models/session');
const sequelize = require('./config/database');
const qrcode = require('qrcode-terminal'); // Add QR code terminal
const { Boom } = require('@hapi/boom'); // Add Boom for error handling
dotenv.config();

// Substituir configuração estática por variáveis de ambiente
const config = {
    whatsapp: {
        sessionPath: process.env.SESSION_PATH || './auth_sessions',
        printQRInTerminal: process.env.PRINT_QR !== 'false'
    },
    openrouter: {
        baseUrl: process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
        apiKey: process.env.OPENROUTER_API_KEY,
        model: process.env.OPENROUTER_MODEL || 'mistralai/mistral-7b-instruct'
    }
};

class WhatsAppBot {
    constructor() {
        this.sock = null;
        this.qr = null;
        this.isConnected = false;
    }

    async start() {
        console.log('🚀 Iniciando WhatsApp Bot...');
        
        // Sincronizar banco de dados
        await sequelize.sync();
        
        // Buscar ou criar nova sessão
        const [session] = await Session.findOrCreate({
            where: { id: 'default' },
            defaults: {
                data: JSON.stringify({}),
                lastUpdate: new Date()
            }
        });

        // Configurar autenticação
        const { state, saveCreds } = await this.getAuthState(session);
        
        // Criar socket de conexão - FIXED LOGGER CONFIGURATION
        this.sock = makeWASocket({
            auth: state,
            // Remove printQRInTerminal as it's deprecated
            // Use proper logger configuration
            logger: {
                level: 'silent',
                // Add minimal logger methods to avoid child error
                child: () => ({
                    trace: () => {},
                    debug: () => {},
                    info: () => {},
                    warn: () => {},
                    error: () => {}
                })
            }
        });

        // Event listeners
        this.sock.ev.on('connection.update', this.handleConnectionUpdate.bind(this));
        this.sock.ev.on('creds.update', saveCreds);
        this.sock.ev.on('messages.upsert', this.handleMessages.bind(this));

        console.log('✅ Bot configurado e aguardando conexão...');
    }

    async getAuthState(session) {
        return {
            state: JSON.parse(session.data),
            saveCreds: async (data) => {
                await Session.update(
                    {
                        data: JSON.stringify(data),
                        lastUpdate: new Date()
                    },
                    { where: { id: 'default' } }
                );
            }
        };
    }

    handleConnectionUpdate(update) {
        const { connection, lastDisconnect, qr } = update;
        
        // Handle QR code manually (since printQRInTerminal is deprecated)
        if (qr) {
            console.log('📱 QR Code gerado. Escaneie com seu WhatsApp:');
            qrcode.generate(qr, { small: true });
            this.qr = qr;
        }

        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error instanceof Boom) 
                ? lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut && lastDisconnect.error.output.statusCode !== 401
                : true;

            console.log("❌ Conexão fechada devido a:", lastDisconnect?.error);
            
            if (lastDisconnect?.error?.output?.statusCode === DisconnectReason.loggedOut || lastDisconnect?.error?.output?.statusCode === 401) {
                console.log("Sessão inválida ou expirada. Removendo dados de sessão e tentando nova conexão...");
                // Clear session data from database
                Session.update(
                    { data: JSON.stringify({}), lastUpdate: new Date() },
                    { where: { id: 'default' } }
                ).then(() => {
                    this.start();
                });
            } else if (shouldReconnect) {
                console.log("🔄 Tentando reconectar...");
                this.start();
            }
            
            this.isConnected = false;
        } else if (connection === 'open') {
            console.log('✅ Conectado ao WhatsApp!');
            this.isConnected = true;
        }
    }

    async handleMessages(m) {
        const msg = m.messages[0];
        
        // Ignorar mensagens próprias e mensagens de status
        if (!msg.message || msg.key.fromMe || msg.key.remoteJid === 'status@broadcast') {
            return;
        }

        // Extrair texto da mensagem
        const messageText = this.extractMessageText(msg);
        
        if (!messageText) {
            return;
        }

        const from = msg.key.remoteJid;
        console.log(`📨 Mensagem recebida de ${from}: ${messageText}`);

        try {
            // Enviar mensagem para OpenRouter e obter resposta
            const response = await this.sendToOpenRouter(messageText);
            
            // Enviar resposta de volta
            await this.sendMessage(from, response);
            
            console.log(`✅ Resposta enviada para ${from}`);
        } catch (error) {
            console.error('❌ Erro ao processar mensagem:', error);
            
            // Enviar mensagem de erro
            await this.sendMessage(from, 'Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.');
        }
    }

    extractMessageText(msg) {
        // Extrair texto de diferentes tipos de mensagem
        if (msg.message.conversation) {
            return msg.message.conversation;
        }
        
        if (msg.message.extendedTextMessage) {
            return msg.message.extendedTextMessage.text;
        }
        
        return null;
    }

    async sendToOpenRouter(message) {
        try {
            const response = await axios.post(
                `${config.openrouter.baseUrl}/chat/completions`,
                {
                    model: config.openrouter.model,
                    messages: [
                        {
                            role: 'user',
                            content: message
                        }
                    ]
                },
                {
                    headers: {
                        'Authorization': `Bearer ${config.openrouter.apiKey}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            return response.data.choices[0].message.content;
        } catch (error) {
            console.error('❌ Erro ao chamar OpenRouter API:', error.response?.data || error.message);
            throw new Error('Falha na comunicação com a API');
        }
    }

    async sendMessage(to, text) {
        if (!this.isConnected) {
            throw new Error('Bot não está conectado');
        }

        await this.sock.sendMessage(to, { text: text });
    }

    async stop() {
        if (this.sock) {
            await this.sock.logout();
            this.sock = null;
            this.isConnected = false;
            console.log('🛑 Bot desconectado');
        }
    }
}

// Inicializar bot
const bot = new WhatsAppBot();

// Manipular sinais de sistema para desconexão limpa
process.on('SIGINT', async () => {
    console.log('\n🛑 Recebido sinal de interrupção. Desconectando...');
    await bot.stop();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n🛑 Recebido sinal de término. Desconectando...');
    await bot.stop();
    process.exit(0);
});

// Iniciar o bot
bot.start().catch(console.error);

console.log('OpenRouter Key:', process.env.OPENROUTER_API_KEY);
console.log('Session Path:', process.env.SESSION_PATH);

module.exports = WhatsAppBot;

