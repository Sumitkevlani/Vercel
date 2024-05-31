import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

const currentDirPath = path.resolve(process.cwd());

console.log(path.join(currentDirPath, 'df564a2d-e864-4b9c-b5ac-cd89e2bce22a'));
async function installDependencies() {
    try {
        const { stdout, stderr } = await execAsync('npm install', { cwd: path.join(currentDirPath, 'df564a2d-e864-4b9c-b5ac-cd89e2bce22a') });
        console.log(`Dependencies installed:\n${stdout}`);
        if (stderr) {
            console.error(`Errors:\n${stderr}`);
        }
    } catch (error) {
        console.error(`Error installing dependencies: ${error}`);
    }
}

async function generateBuild() {
    try {
        const { stdout, stderr } = await execAsync('npm run build', { cwd: path.join(currentDirPath, 'df564a2d-e864-4b9c-b5ac-cd89e2bce22a') });
        console.log(`Build generated:\n${stdout}`);
        if (stderr) {
            console.error(`Errors:\n${stderr}`);
        }
    } catch (error) {
        console.error(`Error generating build: ${error}`);
    }
}

async function installAndBuild() {
    await installDependencies();
    await generateBuild();
}

installAndBuild();