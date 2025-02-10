require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
const userRoutes = require("./routes/userRoutes");
const connectDB = require('./config/dbConfig');
const deleteUserConsumer = require('./consumers/userDeleteConsumer');
const { connectProducer } = require('./producers/kafkaProducer');
const swaggerDocs = require('./config/swaggerConfig');

const app = express();

app.use(bodyParser.json({ limit: '10mb' }));
app.use(morgan('combined'));
app.use(cors());
app.use(helmet());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use("/api/users", userRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'user-create' });
});

// Initialize connections
const initializeConnections = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log('MongoDB connected successfully');

    // Connect Kafka producer
    await connectProducer();
    console.log('Kafka producer connected successfully');

    // Start Kafka consumer
    await deleteUserConsumer.run();
    console.log('Kafka consumer started successfully');

    // Start server
    app.listen(process.env.PORT || 3020, '0.0.0.0', () => {
      console.log(`Server running on port ${process.env.PORT || 3020}`);
    });
  } catch (error) {
    console.error('Failed to initialize services:', error);
    process.exit(1);
  }
};

initializeConnections();

// Unhandled rejection handler
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
  process.exit(1);
});
