
//Configuramos el servidor y llamamos a los modulos exportados de scrapin
const express = require('express');
const fs = require('fs');
const { extraerNoticias } = require('./scraping');
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoint para realizar el scraping
app.get('/scraping', (req, res) => {
    extraerNoticias()
        .then(() => {
            res.send('Scraping completado y datos guardados en noticias.json');
        });
});

// Comenzamos a crear el CRUD
let noticias = [];

// Leer datos desde el archivo JSON
function leerDatos() {
    try {
        const data = fs.readFileSync('noticias.json', 'utf-8');
        noticias = JSON.parse(data);
    } catch (error) {
        console.error('Error al leer el archivo noticias.json:', error.message);
    }
}

// Guardar datos en el archivo JSON
function guardarDatos() {
    fs.writeFileSync('noticias.json', JSON.stringify(noticias, null, 2));
}

// Con este código accedemos a las noticias
app.get('/noticias', (req, res) => {
    leerDatos();
    res.json(noticias);
});

// Código para obtener una noticia por ID y sea más fácil realizar peticiones
app.get('/noticias/:id', (req, res) => {
    leerDatos();
    const noticia = noticias[req.params.id];
    if (noticia) {
        res.json(noticia);
    } else {
        res.status(404).send('Noticia no encontrada');
    }
});

// con POST podemos crear una nueva noticia
app.post('/noticias', (req, res) => {
    leerDatos();
    const nuevaNoticia = req.body;
    noticias.push(nuevaNoticia);
    guardarDatos();
    res.status(201).json(nuevaNoticia);
});

// Código para actualizar o crear si no existe una noticia mediante el método PUT
app.put('/noticias/:id', (req, res) => {
    leerDatos();
    const id = req.params.id;
    if (noticias[id]) {
        noticias[id] = req.body;
        guardarDatos();
        res.json(noticias[id]);
    } else {
        res.status(404).send('Noticia no encontrada');
    }
});

// Código para eliminar una noticia con DELETE utilizando su ID
app.delete('/noticias/:id', (req, res) => {
    leerDatos();
    const id = req.params.id;
    if (noticias[id]) {
        noticias.splice(id, 1);
        guardarDatos();
        res.status(204).send();
    } else {
        res.status(404).send('Noticia no encontrada');
    }
});

app.listen(3000, () => {
    console.log(`Servidor corriendo en http://localhost:3000`);
});