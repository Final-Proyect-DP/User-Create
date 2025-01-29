const kafka = require('../config/kafkaConfig');
const { encrypt } = require('../services/userService');
require('dotenv').config();


const producer = kafka.producer();

const connectProducer = async () => {
  try {
    await producer.connect();
    console.log('Kafka producer connected');
  } catch (error) {
    console.error('Error connecting Kafka producer:', error);
  }
};

const disconnectProducer = async () => {
  try {
    await producer.disconnect();
    console.log('Kafka producer disconnected');
  } catch (error) {
    console.error('Error disconnecting Kafka producer:', error);
  }
};

const sendMessage = async (topic, message) => {
  try {
    
    const encryptedMessage = encrypt(JSON.stringify(message));
    await producer.send({
      topic: topic,
      messages: [{ value: JSON.stringify(encryptedMessage) }]
    });
    console.log('Message sent to topic:', topic);
  } catch (error) {
    console.error('Error sending message:', error);
  }
};

module.exports = { connectProducer, disconnectProducer, sendMessage };
