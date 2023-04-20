// Importamos la biblioteca Express
const express = require("express");

// Importamos el archivo data-library.js que contiene la información sobre los países.
const data = require("../../data/data-library");

// Creamos un router de Express
const router = express.Router();

// Creamos una función de registro que imprime mensajes de registro en la consola
const logger = (message) => console.log(`Countries Service: ${message}`);

// Creamos una ruta GET en la raíz del router que devuelve todos los países
router.get("/", (req, res) => {
  // Creamos un objeto de respuesta con información sobre el servicio y los datos de los países
  const response = {
    service: "countries",
    architecture: "microservices",
    length: data.dataLibrary.countries.length,
    data: data.dataLibrary.countries,
  };
  // Registramos un mensaje en la consola
  logger("Get countries data");
  // Enviamos la respuesta al cliente
  return res.send(response);
});


//Busqueda del pais por medio de la capital
router.get("/country-by-capital", (req, res) => {
  const capital = req.query.capital; // Obtenemos el nombre de la capital de la consulta
  const country = Object.values(data.dataLibrary.countries).find((c) => c.capital === capital);

  // Si no se encuentra el país, devolvemos un error 404
  if (!country) {
    return res.status(404).send({ error: `No se encontró el país correspondiente a la capital ${capital}` });
  }

  // Si se encuentra el país, devolvemos el nombre del país
  const response = {
    country: country.name
  };

  // Registramos un mensaje en la consola
  logger(`Get country by capital: ${capital}`);

  // Enviamos la respuesta al cliente
  return res.send(response);
});


router.get("/country-by-author", (req, res) => {
  const capital = req.query.capital;// Obtenemos el nombre de la capital de la consulta
  const country = Object.values(data.dataLibrary.countries).find((c) => c.capital === capital);// Buscamos el país correspondiente a la capital especificado
  // Si no se encuentra el país, devolvemos un error 404
  if (!country) {
    return res.status(404).send({ error: `No se encontró el país correspondiente a la capital ${capital}` });
  }
  // Si se encuentra el país, hacemos una solicitud HTTP al microservicio de autores para obtener los autores nacidos en ese país.
  fetch(`http://authors:3000/api/v2/authors/country/${country.name}`)
    .then(response => response.json())
    .then(data => {
      // Creamos una respuesta que incluye el nombre del país y los nombres de los autores nacidos en ese país.
      const response = {
        country: country.name,
        authors: data.authors //.map(author => author)
       // authors: data.authors[0]
      };
      // Registramos un mensaje en la consola
      logger(`Get country by capital: ${capital}`);
      // Enviamos la respuesta al cliente
      return res.send(response);
    })
    .catch(error => {
      // Si hay un error en la solicitud HTTP, devolvemos un error 500
      console.error(error);
      return res.status(500).send({ error: "Error en la solicitud HTTP al microservicio de autores." });
    });
});


/*router.get("/distributedBooks/:capital", async (req, res) => {
  const capital = req.params.capital;

  const country = Object.values(data.dataLibrary.countries).find(c => c.capital == capital);
  const books = await fetch(`http://books:4000/api/v2/books/distributedCountries${country[0]}`)
  const data = await response.json();

  const response = {
    country: country.name,
    books
  }

  return res.send(response);
});*/

router.get("/distributedBooks/:capital", async (req, res) => {
  const capital = req.params.capital;

  const country = Object.values(data.dataLibrary.countries).find(c => c.capital == capital);

  try {
    const booksResponse = await fetch(`http://books:4000/api/v2/books/distributedCountries/${country.name}`);
    const booksData = await booksResponse.json();
    const books = booksData.data;

    const response = {
      country: country.name,
      books: books
    };

    return res.send(response);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Error al buscar libros por país");
  }
});






// Exportamos el router
module.exports = router;
