import { Todo } from "@/types/todo";

export default interface AddEditTodoModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave?: (task: Todo) => void;
    task?: Todo | null;
}