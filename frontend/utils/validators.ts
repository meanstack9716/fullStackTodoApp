export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const nameRegex = /^[A-Za-z]{3,}$/;
export const usernameRegex = /^[A-Za-z0-9_]{3,}$/;

export const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Validate email
export const validateEmail = (email: string): string | null => {
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Enter a valid email address";
    return null;
};

// Validate first/last name
export const validateName = (name: string, field: string): string | null => {
    if (!name) return `${field} is required`;
    if (!nameRegex.test(name)) return `${field} must be at least 3 letters`;
    return null;
};

// Validate username
export const validateUsername = (username: string): string | null => {
    if (!username) return "Username is required";
    if (!usernameRegex.test(username)) return "Username must be at least 3 characters (letters, numbers, _)";
    return null;
};


// Validate password
export const validatePassword = (password: string): string | null => {
    if (!password) return "Password is required";
    if (!passwordRegex.test(password)) {
        return "Password must be at least 8 characters, include 1 letter, 1 number, and 1 special character";
    }
    return null;
};

// Confirm password validation
export const validateConfirmPassword = (password: string, confirmPassword: string): string | null => {
    if (!confirmPassword) return "Confirm password is required";
    if (password !== confirmPassword) return "Passwords do not match";
    return null;
};

// Validate task title
export const validateTitle = (title: string): string | null => {
    if (!title) return "Title is required";
    if (title.length < 3) return "Title must be at least 3 characters";
    return null;
};

// Validate date
export const validateDate = (date: string): string | null => {
    if (!date) return "Date is required";
    const selected = new Date(date);
    const now = new Date();
    if (selected < now) return "Date must be in the future";
    return null;
};

// Validate priority
export const validatePriority = (priority: string): string | null => {
    if (!priority) return "Priority is required";
    return null;
};

// Validate description
export const validateDescription = (desc: string): string | null => {
    if (!desc) return "Description is required";
    if (desc.length < 10) return "Description must be at least 10 characters";
    return null;
};