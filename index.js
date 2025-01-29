require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const userRoutes = require("./routes/userRoutes");
const connectDB = require('./config/dbConfig');
const deleteUserConsumer = require('./consumers/userDeleteConsumer');

const app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.json({ limit: '10mb' })); //midelware
app.use(morgan('combined'));
app.use(cors());
app.use(helmet());

connectDB();

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Users API",
      version: "1.0.0",
      description: "API to create users",
    },
  },
  apis: ["./routes/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));


app.use("/api/users", userRoutes);


app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
  deleteUserConsumer.run().catch(console.error);
});
