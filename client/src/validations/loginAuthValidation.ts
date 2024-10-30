import Joi from 'joi';

export const loginAuthValidation = Joi.object({
    email: Joi
        .string()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
            'string.email': 'Invalid email address',
            'string.empty': 'Email address is required',
        }),
    password: Joi
        .string()
        .min(8)
        .required()
        .messages({
            'string.min': 'Password must be at least 8 characters long',
            'string.empty': 'Password is required',
        }),
});
