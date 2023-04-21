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










// Exportamos el router
module.exports = router;
