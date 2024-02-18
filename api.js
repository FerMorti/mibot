/**
 * Archivo api.js
 */

const axios = require('axios');

/**
 * Obtiene los juegos según la plataforma y el tipo de comando.
 * @param {string} url URL de la API para obtener los juegos.
 * @param {string} platform Plataforma de los juegos.
 * @param {Context} ctx Contexto del bot.
 * @param {string} tituloComando Título del comando seleccionado.
 */
async function obtenerJuegos(url, platform, ctx, tituloComando) {
    try {
        const response = await axios.get(url, {
            headers: {
                'X-RapidAPI-Key': '08c9f5fe2fmshb47964ce91c5b6ep1208ecjsn74025458e1b9',
                'X-RapidAPI-Host': 'new-videogames-releases.p.rapidapi.com'
            }
        });
        
        if (!platform) {
            // Si no se proporciona una plataforma, mostrar juegos de todas las plataformas
            const juegosTexto = response.data.slice(0, 15).map(juego => `${juego.title} - Fecha de publicación: ${juego.date} - Plataforma(s): ${juego.platform.join(', ')}`).join('\n\n');
            ctx.reply(`${tituloComando} para todas las plataformas:\n\n${juegosTexto}`);
        } else {
            // Filtrar juegos por plataforma especificada
            const juegos = response.data.filter(juego => juego.platform.includes(platform)).slice(0, 15);
            if (juegos.length === 0) {
                ctx.reply(`No hay juegos disponibles para la plataforma ${platform} en ${tituloComando}.`);
            } else {
                const juegosTexto = juegos.map(juego => `${juego.title} - Fecha de publicación: ${juego.date} - Plataforma(s): ${juego.platform.join(', ')}`).join('\n\n');
                ctx.reply(`${tituloComando} para la plataforma ${platform}:\n\n${juegosTexto}`);
            }
        }
    } catch (error) {
        console.error(error);
        ctx.reply(`Ha ocurrido un error al procesar la solicitud de ${tituloComando}.`);
    }
}

module.exports = { obtenerJuegos };

/**
 * Obtiene libros por rating.
 * @returns {Promise<Array>} Promesa que se resuelve con los libros.
 */
exports.getLibrosPorRating = async () => {
    const options = {
        method: 'GET',
        url: 'https://books-api7.p.rapidapi.com/books/find/rating',
        params: {
            lte: '4',
            gte: '3.5',
            p: '1'
        },
        headers: {
            'X-RapidAPI-Key': '08c9f5fe2fmshb47964ce91c5b6ep1208ecjsn74025458e1b9',
            'X-RapidAPI-Host': 'books-api7.p.rapidapi.com'
        }
    };
    
    try {
        const response = await axios.request(options);
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Obtiene libros por género.
 * @param {Array<string>} generos Lista de géneros.
 * @returns {Promise<Array>} Promesa que se resuelve con los libros.
 */
exports.getLibrosPorGenero = async (generos) => {
    const options = {
        method: 'GET',
        url: 'https://books-api7.p.rapidapi.com/books/find/genres',
        params: {
            'genres[]': generos
        },
        headers: {
            'X-RapidAPI-Key': '08c9f5fe2fmshb47964ce91c5b6ep1208ecjsn74025458e1b9',
            'X-RapidAPI-Host': 'books-api7.p.rapidapi.com'
        }
    };
    
    try {
        const response = await axios.request(options);
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Obtiene libros por título.
 * @param {string} titulo Título del libro.
 * @returns {Promise<Array>} Promesa que se resuelve con los libros.
 */
exports.getLibrosPorTitulo = async (titulo) => {
    const options = {
        method: 'GET',
        url: 'https://books-api7.p.rapidapi.com/books/find/title',
        params: {
            title: titulo
        },
        headers: {
            'X-RapidAPI-Key': '08c9f5fe2fmshb47964ce91c5b6ep1208ecjsn74025458e1b9',
            'X-RapidAPI-Host': 'books-api7.p.rapidapi.com'
        }
    };
    
    try {
        const response = await axios.request(options);
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Obtiene libros por autor.
 * @param {string} nombreAutor Nombre completo del autor.
 * @returns {Promise<Array>} Promesa que se resuelve con los libros.
 */
exports.getLibrosPorAutor = async (nombreAutor) => {
    const [fname, lname] = nombreAutor.split(' ');
    const options = {
        method: 'GET',
        url: 'https://books-api7.p.rapidapi.com/books/find/author',
        params: {
            lname: lname,
            fname: fname
        },
        headers: {
            'X-RapidAPI-Key': '08c9f5fe2fmshb47964ce91c5b6ep1208ecjsn74025458e1b9',
            'X-RapidAPI-Host': 'books-api7.p.rapidapi.com'
        }
    };
    
    try {
        const response = await axios.request(options);
        return response.data;
    } catch (error) {
        throw error;
    }
};
