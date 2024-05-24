const express = require('express');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const Jimp = require('jimp');
const host = process.env.HOST || 'localhost';
const protocol = process.env.PROTOCOL || 'http';
const port = process.env.PORT || 3000;

const app = express();


// Middleware para servir archivos estáticos
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Ruta raíz que devuelve el formulario HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta para procesar la imagen// Ruta para procesar la imagen

app.post('/process-image', async (req, res) => {
    const imageUrl = req.body.imageUrl;
    
    try {
      const image = await Jimp.read(imageUrl);
      const uuid = uuidv4();
      const filename = `${uuid.slice(0, 6)}.jpg`; // Obtener los primeros 6 caracteres del UUID
      image
        .resize(350, Jimp.AUTO)
        .greyscale()
        .write(`public/images/${filename}`, (err) => {
          if (err) throw err;
          const processedImageUrl = `/images/${filename}`;
          const htmlResponse = `
            <div style="text-align: center;">
              <h1 style="margin-bottom: 20px;">Imagen procesada en blanco y negro:</h1>
              <img src="${processedImageUrl}" alt="Imagen procesada" style="display: block; margin: 0 auto; max-width: 100%;">
            </div>
          `;
          res.send(htmlResponse);
        });
    } catch (err) {
      res.status(500).send('Error procesando la imagen.');
    }
  });
  
  
  app.listen(port, () => {
    console.info(`Servidor corriendo en ${protocol}://${host}:${port} | el proceso asociado al servidor es el numero ${process.pid}`);
});
