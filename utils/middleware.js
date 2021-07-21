const User = require('../models/user');

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

