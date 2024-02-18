/**
 * Archivo script.js
 */

const { Telegraf } = require('telegraf');
const mitoken = require('./variables.js');
const bot = new Telegraf(mitoken);
const axios = require('axios');
const { obtenerJuegos } = require('./api.js');
const { Markup } = require('telegraf');

/**
 * Teclado principal del bot.
 * @type {Markup}
 */
const commandKeyboard = Markup.keyboard([
    ['🎮 Juegos Mensuales', '🎮 Juegos Semanales'],
    ['📚 Libros con Rating', '📚 libros por Género'],
    ['⬜Otros comandos⬜']
]).resize();

/**
 * Teclado para seleccionar la plataforma de juegos.
 * @type {Markup}
 */
const juegosKeyboard = Markup.keyboard([
    ['PC', 'PS5', 'PS4'],
    ['Switch', 'XBX/S', 'XBO'],
    ['⬅️ Volver al menú principal'] 
]).resize();

/**
 * Maneja los mensajes relacionados con las plataformas de juegos.
 * @param {Context} ctx Contexto del bot.
 */
bot.hears(['PC', 'PS5', 'PS4', 'Switch', 'XBX/S', 'XBO', '⬅️ Volver al menú principal'], async (ctx) => {
    const plataforma = ctx.message.text;

    if (plataforma === '⬅️ Volver al menú principal') {
        ctx.reply('¡Hola! ' + ctx.from.first_name + ' ' + ctx.from.last_name + ' Soy un bot de noticias de videojuegos y libros. Usa los siguientes comandos para interactuar conmigo:', commandKeyboard);
        return; 
    }
    
    let tituloComando = 'Juegos Mensuales'; 

    if (ctx.message.reply_to_message && ctx.message.reply_to_message.text) {
        tituloComando = ctx.message.reply_to_message.text.split(' ')[1];
    }
    
    const url = tituloComando === 'Juegos Mensuales' ? 'https://new-videogames-releases.p.rapidapi.com/getMonthGames' : 'https://new-videogames-releases.p.rapidapi.com/getWeekGames';
    await obtenerJuegos(url, plataforma, ctx, tituloComando);
});

/**
 * Mensaje inicial del bot.
 * @param {Context} ctx Contexto del bot.
 */
bot.start((ctx) => {
    ctx.reply('¡Hola! ' + ctx.from.first_name + ' ' + ctx.from.last_name + ' Soy un bot de noticias de videojuegos y libros. Usa los siguientes comandos para interactuar conmigo:', commandKeyboard);
});

/**
 * Maneja el comando para mostrar los juegos mensuales.
 * @param {Context} ctx Contexto del bot.
 */
bot.hears('🎮 Juegos Mensuales', (ctx) => {
    ctx.reply('Selecciona una plataforma:', juegosKeyboard);
});

/**
 * Maneja el comando para mostrar los juegos semanales.
 * @param {Context} ctx Contexto del bot.
 */
bot.hears('🎮 Juegos Semanales', (ctx) => {
    ctx.reply('Selecciona una plataforma:', juegosKeyboard);
});

/**
 * Maneja el comando para mostrar los otros comandos disponibles.
 * @param {Context} ctx Contexto del bot.
 */
bot.hears('⬜Otros comandos⬜', (ctx) => {
    ctx.reply('Estos son los otros comandos restantes: - /librosAutor - /librosTitulo (pulsa espacio tras el comando y escribe el nombre del titulo/autor (prueba: Wuthering Heights y Emily Bronte)de la obra)');
});

/**
 * Maneja el comando para mostrar los libros con rating.
 * @param {Context} ctx Contexto del bot.
 */
bot.hears('📚 Libros con Rating', async (ctx) => {
    try {
        const response = await axios.get('https://books-api7.p.rapidapi.com/books/find/rating', {
            params: {
                lte: '5',
                gte: '3.5',
                p: '1'
            },
            headers: {
                'X-RapidAPI-Key': '08c9f5fe2fmshb47964ce91c5b6ep1208ecjsn74025458e1b9',
                'X-RapidAPI-Host': 'books-api7.p.rapidapi.com'
            }
        });

        const librosTexto = response.data.map(libro => `${libro.title} - Autor: ${libro.author.first_name} ${libro.author.last_name} - Puntuación: ${libro.rating}`).join('\n\n');
        
        ctx.reply(`Últimos libros con puntuación entre 3.5 y 5:\n\n${librosTexto}`);
    } catch (error) {
        console.error(error);
        ctx.reply('Ha ocurrido un error al procesar la solicitud de libros por rating.');
    }
});

/**
 * Maneja el comando para mostrar los libros por género.
 * @param {Context} ctx Contexto del bot.
 */
bot.hears('📚 libros por Género', async (ctx) => {
    const generos = ['Fiction', 'Fantasy', 'Classics', 'Philosophy', 'Christian Fiction', 'Religion', 'Christianity', 'Faith', 'Theology', '⬅️ Volver al menú principal'];
    const generosKeyboard = Markup.keyboard(generos, { columns: 2 }).resize();

    ctx.reply('Selecciona un género:', generosKeyboard);
});

/**
 * Maneja la selección de género de libros.
 * @param {Context} ctx Contexto del bot.
 */
bot.hears(['Fiction', 'Fantasy', 'Classics', 'Philosophy', 'Christian Fiction', 'Religion', 'Christianity', 'Faith', 'Theology', '⬅️ Volver al menú principal'], async (ctx) => {
    const genero = ctx.message.text;

    if (genero === '⬅️ Volver al menú principal') {
        ctx.reply('¡Hola! ' + ctx.from.first_name + ' ' + ctx.from.last_name + ' Soy un bot de noticias de videojuegos y libros. Usa los siguientes comandos para interactuar conmigo:', commandKeyboard);
        return; 
    }

    try {
        const response = await axios.get('https://books-api7.p.rapidapi.com/books/find/genres', {
            params: {
                'genres[]': [genero]
            },
            headers: {
                'X-RapidAPI-Key': '08c9f5fe2fmshb47964ce91c5b6ep1208ecjsn74025458e1b9',
                'X-RapidAPI-Host': 'books-api7.p.rapidapi.com'
            }
        });
        const librosTexto = response.data.map(libro => `${libro.title} - Autor: ${libro.author.first_name} ${libro.author.last_name} - Género: ${genero}`).join('\n\n');
        ctx.reply(`Libros del género ${genero}:\n\n${librosTexto}`);
    } catch (error) {
        console.error(error);
        ctx.reply(`Ha ocurrido un error al procesar la solicitud de libros del género ${genero}.`);
    }
});

/**
 * Maneja el comando para buscar libros por título.
 * @param {Context} ctx Contexto del bot.
 */
bot.command('librosTitulo', async (ctx) => {
    const titulo = ctx.message.text.substring(14);
    try {
        const response = await axios.get('https://books-api7.p.rapidapi.com/books/find/title', {
            params: {
                title: titulo
            },
            headers: {
                'X-RapidAPI-Key': '08c9f5fe2fmshb47964ce91c5b6ep1208ecjsn74025458e1b9',
                'X-RapidAPI-Host': 'books-api7.p.rapidapi.com'
            }
        });
        if (response.data.length === 0) {
            ctx.reply(`No se encontraron libros con el título ${titulo}.`);
        } else {
            const librosTexto = response.data.map(libro => `${libro.title} - Autor: ${libro.author.first_name} ${libro.author.last_name}`).join('\n\n');
            ctx.reply(`Libros con título ${titulo}:\n\n${librosTexto}`);
        }
    } catch (error) {
        console.error(error);
        ctx.reply(`Ha ocurrido un error al procesar la solicitud de libros con el título ${titulo}.`);
    }
});

/**
 * Maneja el comando para buscar libros por autor.
 * @param {Context} ctx Contexto del bot.
 */
bot.command('librosAutor', async (ctx) => {
    const nombreAutor = ctx.message.text.substring(13);
    const [fname, lname] = nombreAutor.split(' ');
    try {
        const response = await axios.get('https://books-api7.p.rapidapi.com/books/find/author', {
            params: {
                lname: lname,
                fname: fname
            },
            headers: {
                'X-RapidAPI-Key': '08c9f5fe2fmshb47964ce91c5b6ep1208ecjsn74025458e1b9',
                'X-RapidAPI-Host': 'books-api7.p.rapidapi.com'
            }
        });
        if (response.data.length === 0) {
            ctx.reply(`No se encontraron libros del autor ${nombreAutor}.`);
        } else {
            const librosTexto = response.data.map(libro => `${libro.title} - Géneros: ${libro.genres.join(', ')}`).join('\n\n');
            ctx.reply(`Libros del autor ${nombreAutor}:\n\n${librosTexto}`);
        }
    } catch (error) {
        console.error(error);
        ctx.reply(`Ha ocurrido un error al procesar la solicitud de libros del autor ${nombreAutor}.`);
    }
});

/**
 * Inicia el bot.
 */
bot.launch();
