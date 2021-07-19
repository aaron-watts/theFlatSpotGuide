const User = require('../models/user');

module.exports.rememberPage = (req, res, next) => {
    req.session.returnTo = req.originalUrl;
    next();
}

module.exports.updateFollowers = async (followersOf, update, text) => {
    for (follower of followersOf.following) {
        if (!update.author.equals(follower._id)) {
            const user = await User.findById(follower._id);
            user.notifications.push({
                text,
                status: 'new',
                timestamp: new Date()
            })
            user.save();
        }
    }
}

