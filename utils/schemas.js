const Joi = require('joi');

module.exports.spotSchema = Joi.object({
    spot: Joi.object({
        name: Joi.string()
            .required(),
        location: Joi.string()
            .required(),
        details: Joi.string()
            .required()
    }).required()

})

module.exports.eventSchema = Joi.object({
    event: Joi.object({
        title: Joi.string()
            .required(),
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
    }).required()
})