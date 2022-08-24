const express = require('express'); // Include ExpressJS
const app = express(); // Create an ExpressJS app
const bodyParser = require('body-parser'); // Middleware
const session = require('express-session');  // session middleware
const passport = require('passport');  // authentication
const connectEnsureLogin = require('connect-ensure-login');// authorization
app.use(express.static('public'));
const User = require('./user.js'); // User Model

// Configure Sessions Middleware
app.use(session({
  secret: 'r8q,+&1LM3)CD*zAGpx1xm{NeQhc;#',
  resave: true,
  saveUninitialized: false,
  cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
}));

// Configure Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

// Passport Local Strategy
passport.use(User.createStrategy());

// To use with sessions
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Route to Homepage
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/static/index.html');
});

// Route to Login Page
app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/static/login.html');
});
app.get('/session', function(req, res, next) {

    if (req.session.views) {

      // Increment the number of views.
      req.session.views++

      // Print the views.
      res.write('<p> You have visited this page: '
          + req.session.views + '</p>')
      res.end()
    } else {
      req.session.views = 1
      res.end('Welcome to this page for the first time')
    }
  })

// Route to Secret Page
app.get('/secret', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
  res.sendFile(__dirname + '/static/secret-page.html');
});

// Route to Log out
app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/login');
});

// Post Route: /login
app.post('/login', passport.authenticate('local', { failureRedirect: '/' }),  function(req, res) {
	console.log(req.user)
	res.redirect('/session');
});

const port = 3000 // Port we will listen on

// Function to listen on the port
app.listen(port, () => console.log(`This app is listening on port ${port}`));
