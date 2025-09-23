const validateTodo = ({ title, description, date, priority, expireAt }) => {
    const errors = {};

    if (!title || title.trim() === '') {
        errors.title = 'Title is required';
    } else if (title.trim().length < 3) {
        errors.title = 'Title must be at least 3 characters long';
    }

    if (!description || description.trim() === '') {
        errors.description = 'Description is required';
    } else if (description.trim().length < 10) {
        errors.description = 'Description must be at least 10 characters long';
    }

    if (!date || date.trim() === '') {
        errors.date = 'Date is required';
    } else if (new Date(date) < new Date()) {
        errors.date = 'Date cannot be in the past';
    }

    if (!priority || !["Extreme", "Moderate", "Low"].includes(priority)) {
        errors.priority = 'Priority must be Extreme, Moderate, or Low';
    }

    if (expireAt && new Date(expireAt) < new Date(date)) {
        errors.expireAt = 'Expire time cannot be before the task date';
    }

    return errors;
};

module.exports = { validateTodo };