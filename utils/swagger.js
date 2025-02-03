const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

//options that define the api structure
const options = {
    definition: {
        openapi: "3.0.0",
        info:{
            title: "AgriNexus Waitlist API",
            version:"1.0.0",
            description: "API documentation for AgriNexus Waitlist system",
        },
        servers: [
            {
                url: "http://localhost:5000",
                description: "Development server",
            },
        ],
    },
    apis: ["./routes/waitlist.js"], //path to API routes for documentation
}

const swaggerSpec = swaggerJSDoc(options);

//defining the function to serve the swagger doc
const swaggerDocs = (app) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    app.get("/swagger.json", (req, res) =>{
        res.setHeader("Content-Type", "application/json");
        res.send(swaggerSpec);
    });
};

module.exports = swaggerDocs;