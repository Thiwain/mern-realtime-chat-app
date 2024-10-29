import Joi from "joi";

export const messageValidation = Joi.object({
    sentBy: Joi
        .string()
        .email()
        .required()
        .messages({
            "string.email": "Invalid email address",
            "string.empty": "Email address is required",
        }),
    message: Joi
        .string()
        .min(1)
        .required()
        .messages({
            "string.empty": "Text is required",
        }),
});
