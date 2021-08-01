const { sanitize } = require('express-mongo-sanitize');
const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension);

module.exports.userSchema = Joi.object({
    user: Joi.object({
        email: Joi.string()
            .required(),
        password: Joi.string()
            .required(),
        username: Joi.string()
            .required()
            .escapeHTML()
    })
})

module.exports.spotSchema = Joi.object({
    spot: Joi.object({
        name: Joi.string()
            .required()
            .escapeHTML(),
        location: Joi.string()
            .required()
            .escapeHTML(),
        details: Joi.string()
            .required()
            .escapeHTML(),
        coordinates: Joi.string().regex(/^((\-?|\+?)?\d+(\.\d+)?),\s*((\-?|\+?)?\d+(\.\d+)?)$/)
    }).required(),
    deleteImages: Joi.array()
})

module.exports.eventPinSchema = Joi.object({
    event: Joi.object({
        title: Joi.string()
            .required()
            .escapeHTML(),
        day: Joi.number()
            .min(1)
            .max(31)
            .required(),
        month: Joi.number()
            .min(1)
            .max(12)
            .required(),
        year: Joi.number()
            .min(new Date().getFullYear())
            .required(),
        hours: Joi.number()
            .max(23)
            .required(),
        minutes: Joi.number()
            .max(59)
            .required(),
        description: Joi.string()
            .required()
            .escapeHTML()
    }).required()
})

module.exports.eventSchema = Joi.object({
    event: Joi.object({
        title: Joi.string()
            .required()
            .escapeHTML(),
        spot: Joi.string()
            .required(),
        day: Joi.number()
            .min(1)
            .max(31)
            .required(),
        month: Joi.number()
            .min(1)
            .max(12)
            .required(),
        year: Joi.number()
            .min(new Date().getFullYear())
            .required(),
        hours: Joi.number()
            .max(23)
            .required(),
        minutes: Joi.number()
            .max(59)
            .required(),
        description: Joi.string()
            .required()
            .escapeHTML()
    }).required()
})