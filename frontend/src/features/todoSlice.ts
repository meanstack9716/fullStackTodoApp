
import axiosInstance from "@/api/axiosInstance";
import { CreateTodoData, Todo, TodoList } from "@/types/todo";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

interface TodoState extends TodoList {
    loading: boolean;
    error: string | null;
}
const initialState: TodoState = {
    todos: [],
    currentPage: 1,
    totalPage: 1,
    totalTodos: 0,
    hasNextPage: false,
    hasPreviousPage: false,
    loading: false,
    error: null
}

// Fetch todos 
export const fetchTodos = createAsyncThunk<
    TodoList,
    { page?: number; limit?: number },
    { rejectValue: string }
>("todos/fetchTodos", async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get<TodoList>(`/todos?page=${page}&limit=${limit}`);
        return response.data;
    } catch (err) {
        let errorMessage = "Failed to fetch todos";
        if (err instanceof AxiosError) {
            const apiErrors = err.response?.data?.errors;
            if (apiErrors) {
                errorMessage = Object.values(apiErrors).join(", ");
            } else if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            }
        }
        return rejectWithValue(errorMessage);
    }
});

// Add new todo
export const addTodo = createAsyncThunk<Todo, CreateTodoData, { rejectValue: string }>(
    "todos/addTodo",
    async (todoData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post<Todo>("/todos/add", todoData);
            return response.data;
        } catch (err) {
            let errorMessage = "Failed to add todo";
            if (err instanceof AxiosError) {
                const apiErrors = err.response?.data?.errors;
                if (apiErrors) {
                    errorMessage = Object.values(apiErrors).join(", ");
                } else if (err.response?.data?.message) {
                    errorMessage = err.response.data.message;
                }
            }
            return rejectWithValue(errorMessage);
        }
    }
);

// Edit  todo
export const editTodo = createAsyncThunk<Todo, { id: string; todoData: Partial<CreateTodoData> }, { rejectValue: string }>(
    "todos/editTodo",
    async ({ id, todoData }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put<Todo>(`/todos/edit/${id}`, todoData);
            return response.data;
        } catch (err) {
            let errorMessage = "Failed to edit todo";
            if (err instanceof AxiosError) {
                const apiErrors = err.response?.data?.errors;
                if (apiErrors) {
                    errorMessage = Object.values(apiErrors).join(", ");
                } else if (err.response?.data?.message) {
                    errorMessage = err.response.data.message;
                }
            }
            return rejectWithValue(errorMessage);
        }
    }
);

//delete todo
export const deleteTodo = createAsyncThunk<
    string,
    string,
    { rejectValue: string }
>("todos/deleteTodo", async (id, { rejectWithValue }) => {
    try {
        await axiosInstance.delete(`/todos/delete/${id}`);
        return id;
    } catch (err) {
        let errorMessage = "Failed to delete todo";
        if (err instanceof AxiosError) {
            const apiErrors = err.response?.data?.errors;
            if (apiErrors) {
                errorMessage = Object.values(apiErrors).join(", ");
            } else if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            }
        }
        return rejectWithValue(errorMessage);
    }
});

const todoSlice = createSlice({
    name: "todos",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTodos.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTodos.fulfilled, (state, action) => {
                state.loading = false;

                const page = action.meta.arg.page ?? 1;

                if (page > 1) {
                    state.todos = [...state.todos, ...action.payload.todos];
                } else {
                    state.todos = action.payload.todos;
                }

                state.currentPage = action.payload.currentPage;
                state.totalPage = action.payload.totalPage;
                state.totalTodos = action.payload.totalTodos;

                state.hasNextPage = action.payload.hasNextPage;
                state.hasPreviousPage = action.payload.hasPreviousPage;
            })
            .addCase(fetchTodos.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch todos";
            })
            .addCase(addTodo.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addTodo.fulfilled, (state, action: PayloadAction<Todo>) => {
                state.loading = false;
                state.todos.unshift(action.payload);
                state.totalTodos += 1;
            })
            .addCase(addTodo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to add todo";
            })
            .addCase(editTodo.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(editTodo.fulfilled, (state, action: PayloadAction<Todo>) => {
                state.loading = false;
                const index = state.todos.findIndex(t => t._id === action.payload._id);
                if (index !== -1) {
                    state.todos[index] = action.payload;
                }
            }).addCase(editTodo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to edit todo";
            })
            .addCase(deleteTodo.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteTodo.fulfilled, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.todos = state.todos.filter(todo => todo._id !== action.payload);
                state.totalTodos -= 1;
            })
            .addCase(deleteTodo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to delete todo";
            });
    },
});

export default todoSlice.reducer;