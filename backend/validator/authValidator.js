const { checkSchema } = require("express-validator");

const signupSchema = checkSchema({
    firstName: {
        notEmpty: {
            errorMessage: "First name is required",
        },
    },
    lastName: {
        notEmpty: {
            errorMessage: "Last name is required",
        },
    },
    username: {
        notEmpty: {
            errorMessage: "Username is required",
        },
    },
    email: {
        isEmail: {
            errorMessage: "Invalid email address",
        },
        notEmpty: {
            errorMessage: "Email is required",
        },
    },
    password: {
        notEmpty: {
            errorMessage: "Password is required",
        },
        isLength: {
            options: { min: 8 },
            errorMessage: "Password must be at least 8 characters long",
        },
    },
    confirmPassword: {
        notEmpty: {
            errorMessage: "Confirm password is required",
        },
        custom: {
            options: (value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error("Password and Confirm password don't match");
                }
                return true;
            },
        },
    },
});

const signinSchema = checkSchema({
    email: {
        isEmail: {
            errorMessage: "Invalid email address",
        },
        notEmpty: {
            errorMessage: "Email is required",
        },
    },
    password: {
        notEmpty: {
            errorMessage: "Password is required",
        },
    },
});

module.exports = { signupSchema, signinSchema };
