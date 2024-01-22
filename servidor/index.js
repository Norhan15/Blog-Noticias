const express = require('express');
const cors = require('cors');
const app = express();

const noticias = [
    { id: 1, titulo: "Noticia 1", cuerpo: "Contenido de la noticia 1", autor: "Autor 1", fecha: "Fecha 1" }
];

let responsesClientes = [];

app.use(cors());
app.use(express.json());

app.get('/noticia-nueva', (req, res) => {
    responsesClientes.push(res);

    req.on('close', () => {
        const index = responsesClientes.length; 
        responsesClientes = responsesClientes.slice(index, 1);
    });
})

function responderNoticia(noticia) {
    for (res of responsesClientes) {
        res.status(200).json({
            success: true,
            noticia
        });
    }

    responsesClientes = [];
}

app.get('/noticias', (req, res) => {

    res.status(200).json({
        success: true,
        noticias
    });
});

app.post('/noticias', (req, res) => {
    const idNoticia = noticias.length > 0 ? noticias[noticias.length - 1].id + 1 : 1;

    const noticia = {
        id: idNoticia,
        titulo: req.body.titulo,
        cuerpo: req.body.cuerpo,
        autor: req.body.autor,
        fecha: req.body.fecha
    };

    noticias.push(noticia);
    responderNoticia(noticia);

    return res.status(201).json({
        success: true,
        message: "Noticia guardada exitosamente"
    })
});

app.listen(3000, () => console.log("Servidor corriendo en puerto 3000"));
