import AWS from 'aws-sdk';
import dotenv from 'dotenv';
dotenv.config();

const sqs = new AWS.SQS({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY
    }
});

const queueURL = process.env.SQS_URL;

const processMessages = async () => {
    const params = {
        QueueUrl: queueURL,
        MaxNumberOfMessages: 1,
        WaitTimeSeconds: 20
    };

    try {
        const data = await sqs.receiveMessage(params).promise();
        if (data.Messages) {
            data.Messages.forEach(message => {
                console.log('Received message:', message.Body);
                deployProject(message.Body)
                    .then(() => deleteMessage(message.ReceiptHandle))
                    .catch(error => console.error('Error deploying project:', error));
            });
        } else {
            console.log('No messages available in the queue.');
        }
    } catch (err) {
        console.error('Error receiving messages:', err);
    }
};


const deployProject = async (projectId) => {
    console.log(`Deploying project with ID: ${projectId}`);
};


const deleteMessage = async (receiptHandle) => {
    const params = {
        QueueUrl: queueUrl,
        ReceiptHandle: receiptHandle
    };

    try {
        await sqs.deleteMessage(params).promise();
        console.log('Message deleted from the queue.');
    } catch (err) {
        console.error('Error deleting message:', err);
    }
};

const pollInterval = 5000;
setInterval(processMessages, pollInterval);


console.log('Polling for messages from the queue...');