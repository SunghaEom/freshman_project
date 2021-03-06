var express = require ('express');
var router = express.Router(); // express Router
var passport = require ('passport');


// 페이지 렌더링입니다.
router.get('/', function(req, res){
  res.render ('index', {title: '메인', user: req.user}); 
});
    
router.get('/signin', function(req, res){ // link는 페이지를 분기치기위한 수단과 요청보낼 주소입니다.   
  res.render('sign', { title: '로그인', link : 'signin', message : req.flash('signinMessage')});
});
    
router.get('/signup', function(req, res){
  res.render('sign', { title: '회원가입', link : 'signup', message : req.flash('signupMessage')});
});
    
router.get ('/main', function (req, res){
    res.render ('main'); // 로그인에 성공할시 req.user에 세션값이 담겨있게됩니다.
});

// 로그아웃
router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});
       
// 요청에따른 전략설정입니다.
router.post('/signin', passport.authenticate('local-signin', {
  successRedirect : '/', // 성공시 보내질 요청입니다.
  failureRedirect : '/signin', // 실패시 보내질 요청입니다.
  failureFlash : true
}));
       
router.post('/signup', passport.authenticate('local-signup', {
  successRedirect : '/',
  failureRedirect : '/signup',
  failureFlash : true
}));
     





module.exports =router;