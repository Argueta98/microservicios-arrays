// Importamos la biblioteca Express
const express = require("express");
const csv = require('csv-parser');
const fs = require('fs');

// Importamos el archivo data-library.js que contiene la información sobre los países.

// Creamos un router de Express
const router = express.Router();



//Funcion que permite leer el csv
async function convertCSVToJSON(csvFilePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    try {
      fs.createReadStream(csvFilePath) //Leemos el archivo CSV
        .pipe(csv()) //Pasamos los datos
        .on("data", (data) => {//convierte cada fila en ub objeto json con propiedades de code name
          results.push({
            code: data.alpha2,
            name: data.English
          });
        })
        .on("end", () => {
          resolve(JSON.stringify(results));
        })
        .on("error", (error) => {
          reject(error);
        });
    } catch (error) {
      console.error(error);
    }
  });
}


// Creamos una función de registro que imprime mensajes de registro en la consola
const logger = (message) => console.log(`Language Service: ${message}`);

router.get("/", async (req, res) => {
  try {
    const json = await convertCSVToJSON("./data/language-codes.csv");
    logger("Get languages data");
    res.send(json);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al procesar el archivo CSV");
  }
});


//listar países, donde se hable o se use el determinado lenguaje
router.get('/language/:codeCountry', async (req, res) => {
  try {
    const jsonArray = [];
    fs.createReadStream('./data/language-codes.csv')
      .pipe(csv())
      .on('data', (data) => jsonArray.push(data))
      .on('end', async () => {
        const response = await fetch(`http://countries:5000/api/v2/countries/language/${req.params.codeCountry}`);
        const countries = await response.json();

        const responseObject = {
          data: countries
        };

        return res.send(responseObject);
      });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal server error');
  }
});



router.get('/languageCodeCountry/:codeLanguage', (req, res) => {
  const jsonArray = [];
  
  fs.createReadStream('./data/language-codes.csv')
    .pipe(csv())
    .on('data', (data) => jsonArray.push(data))
    .on('end',async() => {
  
  const resultadoPaises = await fetch(`http://countries:5000/api/v2/countries/language/${req.params.codeLanguage}`);
  const paises = await resultadoPaises.json();
  const nameArray = paises.countries.map(obj => obj.name);

  const resultadoAutores = await fetch(`http://authors:3000/api/v2/authors/country/${nameArray.join(',')}`);
  const autores = await resultadoAutores.json();
  

  const response = {
    data: autores
  };
  
    // Enviamos la respuesta
    return res.send(response);
  });
  
});



router.get('/distributedCountry/:codeLanguage', (req, res) => {
  const jsonArray = [];
  
  fs.createReadStream('./data/language-codes.csv')
    .pipe(csv())
    .on('data', (data) => jsonArray.push(data))
    .on('end',async() => {
  
  const resultadoPaises = await fetch(`http://countries:5000/api/v2/countries/language/${req.params.codeLanguage}`);
  const paises = await resultadoPaises.json();
  const nameArray = paises.countries.map(obj => obj.name);

  const resultadoBooks = await fetch(`http://books:4000/api/v2/books/distributedCountries/${nameArray.join(',')}`);
  const books = await resultadoBooks.json();
  

  const response = {
    data: books
  };
  
    // Enviamos la respuesta
    return res.send(response);
  });
  
});











// Exportamos el router
module.exports = router;
