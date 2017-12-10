const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('User');

const sendJSONresponse = function(res, status, content) {
    res.status(status);
    res.json(content);
};

module.exports.register = function(req, res) {
    let user = new User();
    user.name = req.body.name;
    user.email = req.body.email;
    user.setPassword(req.body.password);
    user.newSessionDate();
    user.save(function(err) {
        if (err) {
            sendJSONresponse(res, 404, err);
        } else {
            let token = user.generateJwt();
            sendJSONresponse(res, 200, {
                "token": token
            });
        }
    });

};

module.exports.login = function(req, res) {
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            sendJSONresponse(res, 404, err);
            return;
        }

        if (user) {
            user.newSessionDate();
            user.save(function(err) {
                if (err) {
                    sendJSONresponse(res, 404, err);
                } else {
                    let token = user.generateJwt();
                    sendJSONresponse(res, 200, {
                        "token": token
                    })
                }
            });
        } else {
            sendJSONresponse(res, 401, info);
        }
    })(req, res);

};