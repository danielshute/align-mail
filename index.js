const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');
const session = require('express-session');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const path = require('path')
require('dotenv').config()
const db = require('./db')
const bot = require('./bot')

app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: false
}));

var d = new Date();
const time = d.toLocaleString(); 

const User = require('./schema/User')
const Character = require('./schema/Character')

// console.log(bot.sendEmbed('541172246207791114', {
//   "content": null,
//   "embeds": [
//     {
//       "title": "📩 Mail received",
//       "description": "You have new mail waiting for you in your inbox\n\nClick [here](https://alignbusiness.solutions/inbox) to view your inbox",
//       "color": 1992447,
//       "timestamp": "2023-09-16T23:00:00.000Z"
//     }
//   ],
//   "attachments": []
// }))

app.get('/', (req, res) => {
  const guide = req.params.guide;
  res.render('pages/splash');
});

app.get('/login', (req, res) => {
  if(req.session.loggedIn == true){
    res.redirect('/characters')
    return
  }

  res.render('pages/login');
});

app.get('/characters', (req, res) => {
  res.render('pages/characters');
});

app.get('/dashboard', (req, res) => {
  res.render('pages/dashboard');
});

app.post('/selectCharacter', async (req, res) => {

})

app.get('/logout', (req, res) => {
  bot.sendEmbedChannel('1153455102082953216', 
  {
    "content": null,
    "embeds": [
      {
        "title": "Align Mail - Logout",
        "description": "Username: `"+req.session.username+"`\nTime: `"+time+"`",
        "color": 2040388
      }
    ],
    "attachments": []
  })

  req.session.username = null;
  req.session.loggedIn = false;

  res.redirect('/login')
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (!user) {
    return res.send({'success':false,'message':'User not found'})
  }

  if (!bcrypt.compareSync(password, user.password)) {
    return res.send({'success':false,'message':'Incorrect password'})
  }

  req.session.username = user.username;
  req.session.loggedIn = true;

  bot.sendEmbedChannel('1153088239570276372', 
    {
      "content": null,
      "embeds": [
        {
          "title": "Align Mail - Login",
          "description": "Username: `"+username+"`\nTime: `"+time+"`",
          "color": 2040388
        }
      ],
      "attachments": []
    }
  )

  res.send({'success':true})
});

app.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  const existingUser = await User.findOne({ username });

  if (existingUser) {
    return res.send({'success':false,'message':'Username already taken'})
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({ username, password: hashedPassword });
  await newUser.save();

  bot.sendEmbedChannel('1153454020397117530', 
    {
      "content": null,
      "embeds": [
        {
          "title": "Align Mail - New Signup",
          "description": "Username: `"+username+"`\nTime: `"+time+"`",
          "color": 2040388
        }
      ],
      "attachments": []
    }
  )

  res.send({'success':true})
});

app.post('/characters/create', async (req, res) => {
  const { forename, surname, address } = req.body;

  const user = await User.findOne({ username: 'daniels' });



  if(user.characters.length > 5){
    return res.send({'success':false,'message':'Maximum characters reached'})
  }

  const existingCharacter = await Character.findOne({ address });

  if (existingCharacter) {
    return res.send({'success':false,'message':'Email address taken!'})
  }

  var count = await Character.count()
  count = count+1

  const newCharacter = new Character({ id: count, forename:forename, surname:surname, address:address });
  await newCharacter.save();

  bot.sendEmbedChannel('1153799160483561582', 
    {
      "content": null,
      "embeds": [
        {
          "title": "Align Mail - New Chracter Created",
          "description": "Username: `"+req.session.username+"`\nTime: `"+time+"`\nCharacter Name: `"+forename+" "+surname+"`\nAdress: `"+address+"@mail.align`",
          "color": 2040388
        }
      ],
      "attachments": []
    }
  )

  res.send({'success':true})
});

app.post('/characters/fetch', async (req, res) => {
  if(req.session.loggedIn != true){
    return res.redirect('/login')
  }

  const user = await User.findOne({ username: req.session.username });

  if(user.characters.length() > 5){
    return res.send({'success':false,'message':'Maximum characters reached'})
  }

  const existingCharacter = await Character.findOne({ address });

  if (existingCharacter) {
    return res.send({'success':false,'message':'Email address taken'})
  }


  const newCharacter = new Character({ forename, surname, address });
  await newCharacter.save();


  res.send({'success':true})
});

app.listen(80, () => {
    console.log('Server is running on port 80');
});