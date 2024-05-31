import { exec } from 'child_process';
import { promisify } from 'util';
import dotenv from 'dotenv';
dotenv.config();
const execAsync = promisify(exec);

async function deployStaticFilesToEC2(projectId) {
    try {
        const localPath = `./${projectId}/dist`;
        const remotePath = process.env.REMOTE_PATH;
        const ec2Hostname = process.env.EC2_HOST_NAME;
        const privateKeyPath = 'C:\\Users\\Reks\\Downloads\\vercel-deployment.pem';
        const username = process.env.EC2_USERNAME;

        // Transfer files to EC2 instance
        const { stdout, stderr } = await execAsync(`scp -i ${privateKeyPath} -r ${localPath} ${username}@${ec2Hostname}:${remotePath}`);

        console.log(`Static files deployed to EC2:\n${stdout}`);
        if (stderr) {
            console.error(`Errors:\n${stderr}`);
        }

        // SSH into EC2 instance and start a simple Node.js server serving static files on port 3000
        await execAsync(`ssh -i ${privateKeyPath} ${username}@${ec2Hostname} "cd ${remotePath} && PORT=3000 npx http-server -p 3000"`);
        console.log("Static files server deployed and running on port 3000");
    } catch (error) {
        console.error(`Error deploying static files to EC2: ${error}`);
    }
}

deployStaticFilesToEC2('df564a2d-e864-4b9c-b5ac-cd89e2bce22a');
