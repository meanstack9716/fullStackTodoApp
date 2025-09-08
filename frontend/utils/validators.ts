export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Validate email
export const validateEmail = (email: string): string | null => {
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Enter a valid email address";
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
