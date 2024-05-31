import simpleGit from 'simple-git';
import generateId from './id_generator.js';

async function cloneRepo(repoURL) {
    const id = generateId();
    const localPath = `./repositories/${id}`;
    try {
        await simpleGit().clone(repoURL, localPath);
        console.log('Repository cloned successfully');
        return id;
    } catch (e) {
        console.log(e);
    }
}

export default cloneRepo;