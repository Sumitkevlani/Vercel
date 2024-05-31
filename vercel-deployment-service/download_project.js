import dotenv from 'dotenv';
import AWS from 'aws-sdk';
import fs from 'fs';
import path from 'path';
dotenv.config();

const { S3 } = AWS;

const s3 = new S3({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY
    }
});

const currentDirPath = path.resolve(process.cwd());

const params = {
    Bucket: process.env.BUCKET_NAME,
    Prefix: 'df564a2d-e864-4b9c-b5ac-cd89e2bce22a/'
};


async function downloadFolder(params) {
    try {
        const data = await s3.listObjectsV2(params).promise();
        for (const obj of data.Contents) {
            const fullPath = path.join(currentDirPath, obj.Key);

            if (obj.Size > 0) {
                const dirName = path.dirname(fullPath);
                if (!fs.existsSync(dirName)) {
                    fs.mkdirSync(dirName, { recursive: true });
                }

                const fileStream = fs.createWriteStream(fullPath);
                await s3.getObject({ Bucket: params.Bucket, Key: obj.Key }).createReadStream().pipe(fileStream);
                console.log('File downloaded:', obj.Key);
            } else {
                const subfolderParams = { Bucket: params.Bucket, Prefix: `${obj.Key}/` };
                await downloadFolder(subfolderParams);
            }
        }
    } catch (err) {
        console.error('Error retrieving folder contents:', err);
    }
}

await downloadFolder(params);
