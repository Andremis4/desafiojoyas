const express = require("express");
const { obtenerJoyas,  obtenerJoyasFiltro,  prepararHateoas} = require("./consulta");
const app = express();
const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));

/* 
app.get("*", (req, res) => {
    res.status(404).send("Esta ruta no existe")
    }) */

const middleware = (req,res,next) => {
    const tiempo = new Date().toISOString();
    const metodo = req.method;
    const url = req.originalUrl;
    const ip = req.ip;
    const mensaje = `${tiempo} - ${metodo} ${url} - IP: ${ip}\n`;
    console.log("informacion middleware" , mensaje);
    next();
} 
app.use(middleware);

app.get("/joyas", async (req, res) => {
  try {
    const queryStrings = req.query;
    const { results: inventario } = await obtenerJoyas(queryStrings); 
    const HATEOAS = await prepararHateoas(inventario);
    res.json({ inventario, HATEOAS });
  } catch (error) {
    console.error("Error al obtener las joyas:", error);
    res.status(500).json({ error: "Error al obtener las joyas" });
  }
});

app.get("/joyas/filtros", async (req, res) => {
  try {
    const queryStrings = req.query;
    const inventario = await obtenerJoyasFiltro(queryStrings);
    res.json(inventario);
  } catch (error) {
    console.error("Error al obtener las joyas:", error);
    res.status(500).json({ error: "Error al obtener las joyas" });
  }
});