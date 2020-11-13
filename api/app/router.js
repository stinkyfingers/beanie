const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const strategy = require('passport-custom').Strategy;
const jwt = require('jsonwebtoken');
const config = require('./config');
const cors = require('cors');
const BeanieV2 = require('./models/beanie.v2');
const UserV2 = require('./models/user.v2');

const router = express.Router();
// strips the /beanieboo route set up for the target group
const stripServer = (req, res, next) => {
  req.url = req.originalUrl.replace('/beanieboo', '');
  next();
};
const authenticationFailure = 'authentication failure';

const strat = new strategy(
  (req, done) => {
    config.getPublicKey()
      .then((publicKey) => {
        const options = {
          algorithm: 'RS256'
        };
        jwt.verify(req.headers.token, publicKey, options, (err, res) => {
          if (err) {
            return done(authenticationFailure, null);
          }
          return done(null, res);
        });
      });
  }
);
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use('authStrategy', strat);
router.use(cors());
router.options('*', cors());
router.use(passport.initialize());
router.use(passport.session());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.json());
router.use(stripServer);

const auth = passport.authenticate('authStrategy', { session: true });

const errHandler = (err, req, res) => {
  console.log({error: err});
  res.status(500).json({error: err.toString()});
};

router.get('/authStatus', auth, errHandler, (req, res) => res.send('hey there, world'));

// S3 based API endpoints
router.get('/v2/beanies/:family/:page?', (req, res, next) => {
  return BeanieV2.family(req.params.family, req.params.page)
    .then(resp => res.status(200).json(resp))
    .catch(next);
});

router.get('/v2/beanie/:family/:name', auth, (req, res, next) => {
  return BeanieV2.get(req.params.family, req.params.name)
    .then(resp => res.status(200).json(resp))
    .catch(next);
});

router.post('/v2/beanie', auth, (req, res, next) => {
  return BeanieV2.create(req.body)
    .then(resp => res.status(200).json(resp))
    .catch(next);
});

router.delete('/v2/beanie/:family/:name', auth, (req, res, next) => {
  return BeanieV2.remove(req.params.family, req.params.name)
    .then(resp => res.status(200).json(resp))
    .catch(next);
});

router.get('/v2/users', auth, (req, res, next) => {
  return UserV2.all()
    .then(resp => res.status(200).json(resp))
    .catch(next);
});

router.get('/v2/user/:username', auth, (req, res, next) => {
  return UserV2.get(req.params.username)
    .then(resp => res.status(200).json(resp))
    .catch(next);
});

router.post('/v2/login', (req, res, next) => {
  return UserV2.login(req.body.username, req.body.password)
    .then(resp => res.status(200).json(resp))
    .catch(next);
});

router.post('/v2/user', (req, res, next) => {
  return UserV2.create(req.body.username, req.body.password, req.body.email)
    .then(resp => res.status(200).json(resp))
    .catch(next);
});

router.put('/v2/user/:listType/:family/:beanie', auth, (req, res, next) => {
  return UserV2.addToList(req.user, req.params.listType, req.params.family, req.params.beanie)
    .then(resp => res.status(200).json(resp))
    .catch(next);
});

router.delete('/v2/user/:listType/:family/:beanie', auth, (req, res, next) => {
  return UserV2.removeFromList(req.user, req.params.listType, req.params.family, req.params.beanie)
    .then(resp => res.status(200).json(resp))
    .catch(next);
});

router.get('/v2/password/:username', (req, res, next) => {
  return UserV2.resetPassword(req.params.username)
    .then(resp => res.status(200).json(resp))
    .catch(next);
});

router.put('/v2/password', auth, (req, res, next) => {
  return UserV2.changePassword(req.body)
    .then(resp => res.status(200).json(resp))
    .catch(next);
});

// Boilerplate
router.all('*', (req, res) => {
  console.log('unsupported path', req.url);
  res.status(404).json({ error: `endpoint not found: ${req.url}` });
});

router.use(errHandler);

module.exports = router;
