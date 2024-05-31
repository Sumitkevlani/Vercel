import fs from 'fs';
import path from 'path';
import pkg from 'aws-sdk';
import dotenv from 'dotenv';

const { S3 } = pkg;
dotenv.config();

const s3 = new S3({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY
    }
});


async function uploadFolderToS3(localFolderPath, bucketName, prefix = '') {
    const files = fs.readdirSync(localFolderPath);
    for (const file of files) {
        const filePath = path.join(localFolderPath, file);
        const stats = fs.statSync(filePath);
        if (stats.isFile()) {
            const fileStream = fs.createReadStream(filePath);
            const key = prefix ? `${prefix}/${file}` : file;
            const uploadParams = {
                Bucket: bucketName,
                Key: key,
                Body: fileStream
            };
            await s3.upload(uploadParams).promise();
            console.log(`Uploaded ${key} to S3`);
        } else if (stats.isDirectory()) {
            const folderKey = prefix ? `${prefix}/${file}` : file;
            const folderParams = {
                Bucket: bucketName,
                Key: folderKey + '/',
                Body: ''
            };
            await s3.upload(folderParams).promise();
            console.log(`Created folder ${folderKey} in S3`);
            await uploadFolderToS3(filePath, bucketName, folderKey);
        }
    }
}


async function uploadRepo(id) {
    await uploadFolderToS3(`./repositories/${id}`, process.env.BUCKET_NAME, id);
}

export default uploadRepo;