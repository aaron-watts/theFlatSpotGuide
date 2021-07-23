const User = require('../models/user');
const ExpressError = require('./ExpressError');
const { spotSchema, eventSchema } = require('../utils/schemas');

module.exports.validateEvent = (req, res, next) => {
    const { error } = eventSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

module.exports.validateSpot = (req, res, next) => {
    const { error } = spotSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

module.exports.rememberPage = (req, res, next) => {
    req.session.returnTo = req.originalUrl;
    next();
}

module.exports.updateFollowers = async (followersOf, update, text, alerted=[]) => {
    const sentTo = [...alerted];
    
    for (follower of followersOf.following) {
        const hasHadAlert = alerted.some(i => i.equals(follower._id)) || false;
        if (!update.author.equals(follower._id) && !hasHadAlert) {
            const user = await User.findById(follower._id);
            user.notifications.push({
                text,
                status: 'new',
                timestamp: new Date()
            })
            await user.save();
            sentTo.push(user._id)
        }
    }

    return sentTo;
}

