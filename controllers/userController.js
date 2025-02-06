const User = require('../models/User');
const { connectProducer, disconnectProducer, sendMessage } = require('../producers/kafkaProducer');
require('dotenv').config();

exports.createUser = async (req, res) => {
  try {
    await connectProducer();
    
    const requiredFields = ['username', 'email', 'password', 'firstName', 'lastName', 
                           'address', 'phone', 'semester', 'parallel', 'career', 'description'];
    
    if (requiredFields.some(field => !req.body[field])) {
      throw new Error('Missing required fields');
    }

    const user = await new User(req.body).save();
    await sendMessage(process.env.KAFKA_TOPIC, { id: user._id, ...user.toObject() });
    
    res.status(201).send({ message: 'User created successfully' });
  } catch (error) {
    res.status(400).send({ error: error.message });
  } finally {
    await disconnectProducer();
  }
};
