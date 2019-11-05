const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const strategy = require('passport-custom').Strategy;
const jwt = require('jsonwebtoken');
const config = require('./config');
const https = require('https');
const cors = require('cors');
const User = require('./models/user');
const Beanie = require('./models/beanie');

const router = express.Router();
// strips the /flashcards route set up for the target group
const stripServer = (req, res, next) => {
  req.url = req.originalUrl.replace('/beanieboo', '');
  next();
}
const authenticationFailure = 'authentication failure';
const notAuthorized = 'not authorized';

const strat = new strategy(
  (req, done) => {
    config.getPublicKey()
    .then((publicKey) => {
      const options = {
        algorithm: 'RS256'
      };
      const ok = jwt.verify(req.headers.token, publicKey, options, (err, res) => {
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
router.use(cors())
router.use(passport.initialize());
router.use(passport.session());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.json());
router.use(stripServer);

const auth = passport.authenticate('authStrategy', { session: true });

const errHandler = (err, req, res, next) => {
  console.log(err)
  res.status(500).json({error: err.toString()});
}

router.get('/authStatus', auth, errHandler, (req, res, next) => res.send('hey there, world'));

router.post('/login', async (req, res, next) => {
  const user = new User(req.body.username, req.body.password);
  try {
    await user.login();
  } catch(err) {
    next(err);
    return;
  }

  if (user.password !== req.body.password) {
    res.status(400).send('wrong password');
    return;
  }
  user.password = null;
  config.getPrivateKey()
  .then(async(privateKey) => {
    const options = {
      algorithm: 'RS256'
    };
    const token = await jwt.sign(JSON.stringify(user), privateKey, options);
    const loginResp = {
      token: token,
      username: user.username,
      admin: user.admin
    }
    res.json(loginResp);
  }).catch((err) => {
    res.error('error getting private key: ', err)
  })
});

router.get('/user/:username', auth, async (req, res, next) => {
  const user = new User(req.params.username)
  try {
    res.json(await user.get());
  } catch(err) {
    next(err);
  }
});

router.post('/user', async (req, res, next) => {
  const user = new User(req.body.username, req.body.password);
  try {
    res.json(await user.create());
  } catch (err) {
    next(err);
  }
});

router.post('/beanies', auth, async (req, res, next) => {
  if (!req.user.admin) {
    next(notAuthorized)
  }
  try {
    const beanie = new Beanie(
      req.body.name,
      req.body.image,
      req.body.family,
      req.body.number,
      req.body.variety,
      req.body.animal,
      req.body.exclusiveTo,
      req.body.birthday,
      req.body.introDate,
      req.body.retireDate,
      req.body.height,
      req.body.length,
      req.body.st,
      req.body.tt
    )
    const b = await beanie.create()
    res.json(b);
  } catch (err) {
    console.warn(err);
    next(err);
  }
});

router.put('/beanies', auth, async (req, res, next) => {
  if (!req.user.admin) {
    next(notAuthorized)
  }
  try {
    const beanie = new Beanie(
      req.body.name,
      req.body.image,
      req.body.family,
      req.body.number,
      req.body.variety,
      req.body.animal,
      req.body.exclusiveTo,
      req.body.birthday,
      req.body.introDate,
      req.body.retireDate,
      req.body.height,
      req.body.length,
      req.body.st,
      req.body.tt
    );
    const b = await beanie.upsert();
    res.json(b);
  } catch (err) {
    console.warn(err);
    next(err);
  }
});

router.get('/beanies', auth, async (req, res, next) => {
  try {
    const beanies = await Beanie.all();
    res.json(beanies);
  } catch (err) {
    console.warn(err);
    next(err);
  }
});

router.get('/beanie/:name', auth, async (req, res, next) => {
  try {
    const beanie = new Beanie(req.params.name);
    const b = await beanie.get()
    res.json(b);
  } catch (err) {
    console.warn(err);
    next(err);
  }
});

router.get('*', (req, res) => {
  console.log('NOP')
  console.log('req', req.originalUrl,'...', req.url)
  res.send('I catch everything')
});

router.use(errHandler);

module.exports = router;
