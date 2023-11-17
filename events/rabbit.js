const AMQP = require("amqplib");
require("dotenv").config();
const FS = require("fs");

//Path for logging the rabbitmq logs when the user registers
let PATH = "./logs/rabbitlogs.log";


/*Function for setting the RabbitMQ instance for event processing. 
RabbitMQ config is given in the ENV FILE.
*/
async function setupRabbitMQ() {
  try {
    //creating the connection to connect to rabbitmq server
    const connection = await AMQP.connect(process.env.RABBIT_MQ_URL);
    const channel = await connection.createChannel();
    // asserting the queue
    await channel.assertQueue(process.env.REGISTER_EVENT_QUEUE);
    return channel;
  } catch (err) {
    return err;
  }
}

/*
Function for the event subscribe , it addd the message to queue and then  handling the queue and 
write the log in given file at given file path .
*/
async function setupEventSubscriber() {
  try {
    const connection = await AMQP.connect(process.env.RABBIT_MQ_URL);
    //for creating the channel and inserting in the queue
    const channel = await connection.createChannel();
    await channel.assertQueue(process.env.REGISTER_EVENT_QUEUE);

    //Handling the queue and writing it in logs
    // Consume messages from the queue and log them to a file
    channel.consume(process.env.REGISTER_EVENT_QUEUE, (msg) => {
      const data = JSON.parse(msg.content.toString());
      //stringigfy the data upon registering in the queue
      const message = JSON.stringify(
        `User registered: ${JSON.stringify(data)}`
      );
      const LOG = `${message}\n`;
      //Log the message queue it to a file
      const logStream = FS.createWriteStream(PATH, { flags: 'a', encoding: 'utf8' });
      //writing the log to the file.
      logStream.write(LOG, (err) => {
        if (err) {
          console.error("Error in Logging the file:", err);
        } else {
          // Acknowledge the message to remove it from the queue
          channel.ack(msg);
        }
      });
      logStream.end();
    });
  } catch (err) {
    return err;
  }
}

module.exports = {
  setupRabbitMQ,
  setupEventSubscriber,
};
