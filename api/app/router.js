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
const request = require('request');

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
router.options('*', cors())
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
    res.status(400).json({error :'wrong password'});
    return;
  }
  user.password = null;
  config.getPrivateKey()
  .then(async(privateKey) => {
    const options = {
      algorithm: 'RS256'
    };
    const token = await jwt.sign(JSON.stringify(user), privateKey, options);
    res.json({...user, token});
  }).catch((err) => {
    res.error('error getting private key: ', err)
  })
});

router.post('/user/beanies', auth, async (req, res, next) => {
  const user = new User(req.body.username)
  user.beanies = req.body.beanies;
  try {
    res.json(await user.updateBeanies());
  } catch (err) {
    next(err);
  }
});

router.post('/user/wantlist', auth, async (req, res, next) => {
  const user = new User(req.body.username)
  user.wantlist = req.body.wantlist;
  try {
    res.json(await user.updateWantlist());
  } catch (err) {
    next(err);
  }
});

router.get('/user/:username', auth, async (req, res, next) => {
  const user = new User(req.params.username)
  try {
    res.json(await user.get());
  } catch(err) {
    next(err);
  }
});

router.get('/users', auth, async (req, res, next) => {

  try {
    const users = await User.all()
    res.json(users);
  } catch(err) {
    next(err);
  }
});

router.post('/user', async (req, res, next) => {
  const user = new User(req.body.username, req.body.password);
  user.email = req.body.email;
  try {
    res.json(await user.create());
  } catch (err) {
    next(err);
  }
});

router.put('/password', async (req, res, next) => {
  const user = new User(req.body.username, '');
  try {
    res.json(await user.resetPassword());
  } catch (err) {
    next(err);
  }
});

router.post('/beanies', auth, async (req, res, next) => {
  if (!req.user.admin) {
    next(notAuthorized)
  }
  try {
    const beanie = new Beanie(req.body)
    const b = await beanie.create()
    res.json(b);
  } catch (err) {
    console.warn(err);
    next(err);
  }
});

router.get('/beanie/:family/:name', auth, async (req, res, next) => {
  try {
    const beanie = new Beanie({name: req.params.name, family: req.params.family});
    const b = await beanie.get()
    res.json(b);
  } catch (err) {
    console.warn(err);
    next(err);
  }
});

router.delete('/beanie/:family/:name', auth, async (req, res, next) => {
  const beanie = new Beanie({ name: req.params.name, family: req.params.family });
  try {
    await beanie.delete();
    res.json(beanie)
  } catch (err) {
    console.warn(err);
    next(err);
  }
});

router.get('/beanies/:family', async (req, res, next) => {
  try {
    const beanies = await Beanie.family(req.params.family);
    res.json(beanies);
  } catch (err) {
    console.warn(err);
    next(err);
  }
});

router.all('*', (req, res) => {
  console.log('unsupported path', req)
  res.send('I catch everything')
});

router.use(errHandler);

module.exports = router;
