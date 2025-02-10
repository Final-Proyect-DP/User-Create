const kafka = require('../config/kafkaConfig');
const { decryptMessage } = require('../services/userService');
const User = require('../models/User');

const consumer = kafka.consumer({ groupId: 'User-Create-Delete-Consumer' });

const run = async () => {
  try {
    await consumer.connect();
    await consumer.subscribe({ topic: process.env.KAFKA_TOPIC_DELETE, fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ message }) => {
        const decryptedMessage = decryptMessage(JSON.parse(message.value.toString()));
        const { id } = JSON.parse(decryptedMessage);
        const user = await User.findByIdAndDelete(id);
        console.log(user ? `User deleted: ${id}` : `User not found: ${id}`);
      }
    });
  } catch (error) {
    console.error('Error in Kafka consumer:', error);
  }
};

module.exports = { run };
