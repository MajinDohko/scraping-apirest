//Configuramos los modulos necesarios para realizar el scraping
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const url = 'https://elpais.com/ultimas-noticias/';

//Creamos una función que recoja los elementos que nos piden y luego la vamos a exportar al archivo app.
function extraerNoticias() {
    return axios.get(url)
        .then(response => {
            const $ = cheerio.load(response.data);
            let noticias = [];

            //Decimos a cheerio que datos queremos extraer de las noticias
            $('article.c.c-d.c--m').each((index, element) => {
                const titulo = $(element).find('header.c_h').text();
                const descripcion = $(element).find('p.c_d').text();
                const enlace = $(element).find('a').attr('href');
                const imagen = $(element).find('img').attr('src');

                const noticia = {
                    titulo: titulo,
                    imagen: imagen,
                    descripcion: descripcion,
                    enlace: enlace,
                };
                noticias.push(noticia);
            });
            
            //Línea de código para generar un archivo con el array y los objetos dentro.
            fs.writeFileSync('noticias.json', JSON.stringify(noticias, null, 2));
        })
        .catch(error => {
            console.error('Error al realizar el scraping:', error.mensaje);
        });
}

//Exportamos la funcion para poder usarla en app.js
module.exports = { extraerNoticias };

