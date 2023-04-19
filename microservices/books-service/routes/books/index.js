const express = require("express"); // importa Express
const router = express.Router(); // crea un nuevo enrutador de Express
const data = require("../../data/data-library"); // importa los datos de data-library
const fetch = require("node-fetch");




const logger = (message) => console.log(`Books Services: ${message}`);

// define un controlador para la ruta raíz ("/")
router.get("/", (req, res) => {
  const response = {
    // crea una respuesta con información sobre los libros
    service: "books",
    architecture: "microservices",
    length: data.dataLibrary.books.length,
    data: data.dataLibrary.books,
  };
  logger("Get book data"); // registra un mensaje en los registros
  return res.send(response); // devuelve la respuesta al cliente
});

//Busqueda por nombre de author
router.get("/author/:author", async (req, res) => {
  const author = req.params.author;
  try {
  
    const response = await fetch(`http://authors:3000/api/v2/authors/author/${author}`);
    const authorData = await response.json();
    const books = data.dataLibrary.books.filter((book) => book.authorid === authorData.data[0].id);
    const responseObj = {
      service: "books",
      architecture: "microservices",
      data: books,
    };
    return res.send(responseObj);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Error al buscar libros por autor");
  }
});

//Busqueda por id
router.get("/author/:id", async (req, res) => {
  const id = req.params.id;
  try {
  
    const response = await fetch(`http://authors:3000/api/v2/authors/${id}`);
    const authorData = await response.json();
    const books = data.dataLibrary.books.filter((book) => book.authorid === authorData.data[0].id);
   //const books = authorData.data.books;
    const responseObj = {
      service: "books",
      architecture: "microservices",
      data: books,
    };
    return res.send(responseObj);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Error al buscar libros por autor");
  }
});

//Busqueda Entre anios 
router.get("/between/:startYear/:endYear", (req, res) => {
  const startYear = parseInt(req.params.startYear);
  const endYear = parseInt(req.params.endYear);

  if (isNaN(startYear) || isNaN(endYear)) {
    return res.status(400).send("Año de inicio o fin no válido");
  }

  const filteredBooks = data.dataLibrary.books.filter(
    (book) => book.year >= startYear && book.year <= endYear
  );

  const responseObj = {
    service: "books",
    architecture: "microservices",
    length: filteredBooks.length,
    data: filteredBooks,
  };

  return res.send(responseObj);
});

//Busqueda mayor e igual 1900
router.get("/after/:year", (req, res) => {
  const year = parseInt(req.params.year);
  const books = data.dataLibrary.books.filter((book) => book.year >= year);
  const responseObj = {
    service: "books",
    architecture: "microservices",
    length: books.length,
    data: books,
  };
  return res.send(responseObj);
});
//Busqueda menor e igual 1900
router.get("/before/:year", (req, res) => {
  const year = parseInt(req.params.year);
  const books = data.dataLibrary.books.filter((book) => book.year <= year);
  const responseObj = {
    service: "books",
    architecture: "microservices",
    length: books.length,
    data: books,
  };
  return res.send(responseObj);
});

//Busqueda menor e igual 1900
router.get("/equal/:year", (req, res) => {
  const year = parseInt(req.params.year);
  const books = data.dataLibrary.books.filter((book) => book.year == year);
  const responseObj = {
    service: "books",
    architecture: "microservices",
    length: books.length,
    data: books,
  };
  return res.send(responseObj);
});







/*
router.get("/author/:author", async (req, res) => {
  const author = await fetch(`http://authors:3000/api/v2/authors/${req.params.author}/`).then(response => response.json());

  const searchBook = data.dataLibrary.books.filter(book => book.authorid === author.data[0].id);

  const response = {
    response: searchBook
  };

  return res.send(response);
})
*/





// define un controlador para la ruta "/title/:title"
router.get("/title/:title", (req, res) => {
  // busca los libros que contengan el título buscado
  const titles = data.dataLibrary.books.filter((title) => {
    return title.title.includes(req.params.title);
  });
  // crea una respuesta con información sobre los libros que coinciden con el título buscado
  const response = {
    service: "books",
    architecture: "microservices",
    length: titles.length,
    data: titles,
  };
  return res.send(response); // devuelve la respuesta al cliente
});

module.exports = router; // exporta el enrutador de Express para su uso en otras partes de la aplicación

/*
Este código es un ejemplo de cómo crear una API de servicios utilizando Express y un enrutador. El enrutador define dos rutas: una para obtener todos los libros y otra para obtener libros por título. También utiliza una función simple de registro para registrar mensajes en los registros.
*/
