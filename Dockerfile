# Use the official Node.js image as the base image
FROM node:22

# Set the working directory
WORKDIR /usr/src/app

# Copiar primero el package.json y el .env
COPY package*.json .env ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Expose the port the app runs on
EXPOSE 3020

# Command to run the application
CMD ["npm", "start"]
