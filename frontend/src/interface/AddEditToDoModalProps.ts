import { Task } from "./Task";

export default interface AddEditTodoModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (task: Task) => void;
    task?: Task | null; 
}