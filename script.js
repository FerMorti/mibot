const { Telegraf } = require('telegraf');
const mitoken = require('./variables.js');
//module.exports= {mitoken};
const bot = new Telegraf(mitoken);
console.log(mitoken);

// Manejar comando /start
bot.start((ctx) => {
    ctx.reply('¡Hola! Soy un bot de noticias de videojuegos. Usa /news para obtener las últimas noticias.');
});

// Manejar comando /news
bot.hears('/news', async (ctx) => {
    // Aquí puedes llamar a tu API de noticias de videojuegos y enviar las noticias al usuario
    console.log(ctx);
    ctx.reply("dsfsasdasdasdds");
});

// Iniciar el bot
bot.launch();
