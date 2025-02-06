const kafka = require('../config/kafkaConfig');
const { encrypt } = require('../services/userService');
require('dotenv').config();

const producer = kafka.producer();
let isConnected = false;

const connectProducer = async () => {
  try {
    if (!isConnected) {
      await producer.connect();
      isConnected = true;
      console.log('Producer connected successfully');
    }
  } catch (error) {
    isConnected = false;
    console.error('Error connecting producer:', error);
    throw error;
  }
};

const disconnectProducer = async () => {
  try {
    if (isConnected) {
      await producer.disconnect();
      isConnected = false;
      console.log('Producer disconnected successfully');
    }
  } catch (error) {
    console.error('Error disconnecting producer:', error);
    throw error;
  }
};

const sendMessage = async (topic, message) => {
  try {
    if (!isConnected) {
      await connectProducer();
    }
    const encryptedMessage = encrypt(JSON.stringify(message));
    await producer.send({
      topic: topic,
      messages: [{ value: JSON.stringify(encryptedMessage) }]
    });
    console.log('Message sent to topic:', topic);
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

module.exports = { connectProducer, disconnectProducer, sendMessage, isConnected };
