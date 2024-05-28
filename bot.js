const TelegramBot = require('node-telegram-bot-api');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const bot = new TelegramBot('TOKEN_DO_SEU_BOT', { polling: true });

// Função para enviar a mensagem inicial
async function sendInitialMessage(chatId) {
    await bot.sendMessage(chatId, 'Fora do horário comercial! O horário de funcionamento é de 09:00 às 18:00. Por favor, deixe seu e-mail para entrarmos em contato.');
}

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const messageDate = new Date(msg.date * 1000);
    const messageHour = messageDate.getHours();

    // Variável de controle para verificar se a mensagem inicial foi enviada após as 18 horas
    let initialMessageSent = false;

    // Verifica se a mensagem foi recebida fora do horário comercial
    if (messageHour < 9 || messageHour >= 18) {
        // Verifica se o usuário enviou um e-mail
        if (msg.text && validateEmail(msg.text)) {
            const email = msg.text;
            try {
                // Tenta salvar o e-mail no banco de dados
                await prisma.email.create({
                    data: {
                        email: email
                    }
                });
                // Se o e-mail foi salvo com sucesso, envia a mensagem de confirmação
                await bot.sendMessage(chatId, 'Seu e-mail foi registrado com sucesso. Entraremos em contato em breve.');
            } catch (error) {
                // Se houve um erro ao salvar o e-mail, envia uma mensagem de erro
                await bot.sendMessage(chatId, 'Ocorreu um erro ao salvar seu e-mail. Por favor, tente novamente mais tarde.');
                console.error('Erro ao salvar e-mail no banco de dados:', error);
            }
        } else {
            // Se o usuário não enviou um e-mail, e a mensagem inicial não foi enviada após as 18 horas, envia a mensagem inicial
            if (!initialMessageSent) {
                await sendInitialMessage(chatId);
                initialMessageSent = true;
            }
        }
    } else {
        // Se a mensagem foi recebida durante o horário comercial, envia a mensagem padrão
        await bot.sendMessage(chatId, 'Horário comercial! Acesse: https://faesa.br');
    }
});

bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    await bot.sendMessage(chatId, 'Olá! Bem-vindo ao nosso BOT de atendimento. Como posso ajudá-lo?');
});

bot.onText(/\/help/, async (msg) => {
    const chatId = msg.chat.id;
    await bot.sendMessage(chatId, 'Você pode enviar uma mensagem a qualquer momento e eu irei ajudá-lo. Se precisar de assistência fora do horário comercial, por favor, deixe seu e-mail.');
});

// Função para validar e-mail
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}
