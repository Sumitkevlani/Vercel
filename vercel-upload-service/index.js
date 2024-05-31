import express from 'express';
import cors from 'cors';
import AWS from 'aws-sdk';
import cloneRepo from './cloning_repo.js';
import uploadRepo from './uploading_repo.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT;

const sqs = new AWS.SQS({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY
    }
});

app.use(cors());
app.use(express.json());

app.post('/deploy', async (req, res) => {
    try {
        const repoURL = req.body.repoURL;
        const id = await cloneRepo(repoURL);
        console.log(id);
        await uploadRepo(id);
        const params = {
            MessageGroupId: 'vercel-projects',
            MessageBody: id,
            QueueUrl: process.env.SQS_URL,
        };
        const data = await sqs.sendMessage(params).promise();
        console.log("Message sent, ID:", data.MessageId);
        res.json({ id: id });
    } catch (e) {
        console.log(e);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});