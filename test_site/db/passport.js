var LocalStrategy = require ('passport-local').Strategy;
var User = require ('./UserModel');

module.exports = function (passport){
    passport.serializeUser ((user, done) => {
        done (null, user.id);
    });
    passport.deserializeUser ((id, done) => {
        User.findById (id, (err, user) => {
            done (err, user);
        })
    });
    
/* Register */
passport.use ('local-signup', new LocalStrategy ({
    usernameField: 'email',
    passwordField: 'password', 
    passReqToCallback: true
}, (req, email, password, done) => {
    User.findOne ({'email': email}, function (err, user) {
        if (err) return done (err);
        if (user) return done (null, false, req.flash ('signupMessage', '중복된 아이디입니당'));
        const newUser = new User ();
        newUser.email = email;
        newUser.password = newUser.generateHash(password);
        newUser.name = req.body.name;
        
        newUser.save (function (err){
            if (err) throw err;
            return done (null, newUser);
        });
    })
}));
    
/* Login */
passport.use ('local-signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function (req, email, password, done){
    User.findOne ({'email': email}, function (err, user){
        if (err) return (err);
        if (!user) return done (null, false, req.flash ('signinMessage', '아이디가 존재하지 않습니당'));
        if (!user.validPassword (password)) return done (null, false, req.flash ('signinMessage', '비번이 틀렸습니당'));
        return done (null, user);
    });
}));
}