import { v4 } from 'uuid';
function generateId() {
    const projectId = v4();
    return projectId;
}
export default generateId;