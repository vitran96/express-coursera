const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const FacebookTokenStrategy = require('passport-facebook-token');

const config = require('./config.js');
const fbConfig = require('./fb.config');

const User = require('./models/user');

exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = user => {
    return jwt.sign(
        user
        , config.secretKey
        , { expiresIn: 60 * 60 }
    );
};

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.secretKey
};

exports.jwtPassport = passport.use(new JwtStrategy(
    opts
    , (jwt_payload, done) => {
        // console.log("JWT payload: ", jwt_payload);
        User.findOne(
            { _id: jwt_payload._id }
            , (err, user) => {
                if (err) {
                    return done(err, false);
                } else if (user) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            });
    }));

exports.verifyUser = passport.authenticate('jwt', { session: false });

exports.verifyAdmin = (req, res, next) => {
    if (req.user.admin) {
        return next();
    }

    var err = Error('You are not authorized to perform this task');
    err.status = 403;
    next(err);
}

// This may fail if Browser block tracker
exports.facebookPassport = passport.use(new FacebookTokenStrategy({
    clientID: fbConfig.clientId,
    clientSecret: fbConfig.clientSecret
}, (accessToken, refreshToken, profile, done) => {
    console.log("hello");
    User.findOne({ facebookId: profile.id }, (err, user) => {
        if (err) {
            return done(err, false);
        } else if (!err && user !== null) {
            return done(null, user);
        } else {
            user = new User({
                facebookId: profile.id,
                username: profile.displayName,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                admin: false
            });

            user.save((err) => {
                if (err) {
                    return done(err, false);
                }
                return done(null, user);
            });
        }
    });
}));
