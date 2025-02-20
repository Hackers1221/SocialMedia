const Joi = require('joi');

module.exports.userSchema = Joi.object({
    name: Joi.string()
        .required()
        .pattern(new RegExp("^[A-Za-z]+$"))
        .messages({
            "string.base": "Name must be a text value.",
            "string.empty": "Name cannot be empty.",
            "any.required": "Name is required.",
            "string.pattern.base": "Name can only contain characters."
        }),

    username: Joi.string()
        .required()
        .pattern(new RegExp('^[a-z0-9]+$'))
        .messages({
            "string.base": "Username must be a text value.",
            "string.empty": "Username cannot be empty.",
            "any.required": "Username is required.",
            "string.pattern.base": "Username can only contain lowercase letters and numbers."
        }),

    email: Joi.string()
        .email()
        .required()
        .messages({
            "string.base": "Email must be a valid text value.",
            "string.empty": "Email cannot be empty.",
            "string.email": "Email must be a valid email address.",
            "any.required": "Email is required."
        }),

    password: Joi.string()
        .required()
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]+$'))
        .messages({
            "string.base": "Password must be a text value.",
            "string.empty": "Password cannot be empty.",
            "any.required": "Password is required.",
            "string.pattern.base": "Password must have at least one uppercase letter, one lowercase letter, one number, and one special character."
        }),

    birth: Joi.string()
        .messages({
            "date.base": "Birthdate must be a valid date."
        })
});
