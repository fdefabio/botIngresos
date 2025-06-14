require('dotenv').config();
const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

// Reglas del grupo
const REGLAS = `
📜 *Reglas del grupo*:

1️⃣ No spam  
2️⃣ Respeto mutuo  
3️⃣ No contenido ilegal  
4️⃣ Sigue las instrucciones de los admins  

✅ Si aceptas las reglas, pulsa el botón "Aceptar".
`;

// Cuando alguien solicita unirse
bot.on('chat_join_request', async (ctx) => {
    const { user, chat } = ctx.chatJoinRequest;

    try {
        await ctx.telegram.sendMessage(user.id, REGLAS, {
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [{ text: '✅ Acepto las reglas', callback_data: `accept_${chat.id}` }],
                ],
            },
        });
    } catch (err) {
        console.error('No se pudo enviar mensaje al usuario:', err);
    }
});

// Cuando aceptan las reglas
bot.on('callback_query', async (ctx) => {
    const callbackData = ctx.callbackQuery.data;

    if (callbackData.startsWith('accept_')) {
        const chatId = callbackData.split('_')[1];
        const userId = ctx.from.id;

        // Notifica a los admins (opcional)
        await ctx.telegram.sendMessage(
            chatId,
            `👤 El usuario [${ctx.from.first_name}](tg://user?id=${userId}) ha aceptado las reglas. Por favor revisa su solicitud.`,
            { parse_mode: 'Markdown' }
        );

        await ctx.answerCbQuery('Gracias. Un admin te aprobará pronto.');
    }
});

bot.launch();
console.log('🤖 Bot en funcionamiento...');
