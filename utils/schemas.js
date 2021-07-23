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
        date: Joi.date()
            .greater('now')
            .required(),
        title: Joi.string()
            .required(),
        description: Joi.string()
            .required()
    }).required()
})