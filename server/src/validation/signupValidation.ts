import Joi from "joi";

export const signupValidation = Joi.object({

    email: Joi
        .string()
        .email()
        .required()
        .messages({
            "string.email": "Invalid email address",
            "string.empty": "Email address is required",
        }),
    password: Joi
        .string()
        .min(8)
        .required()
        .messages({
            "string.min": "Password must be at least 8 characters long",
            "string.empty": "Password is required",
        }),
    rememberMe: Joi.boolean().optional().default(false),
    role: Joi
        .string()
        .optional()
        .default("client"),
    active: Joi
        .boolean()
        .optional()
        .default(true),

});
