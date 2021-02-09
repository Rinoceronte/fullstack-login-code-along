// require('dotenv').config();
// const express = require('express');
// const session = require('express-session');
// const bcrypt = require('bcryptjs');
// const massive = require('massive');

// const app = express();

// app.use(express.json());

// let { SERVER_PORT, CONNECTION_STRING, SESSION_SECRET } = process.env;

// app.use(
//   session({
//     secret: SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false
//   })
// );

// massive(CONNECTION_STRING).then(db => {
//   app.set('db', db);
// });

// app.post('/auth/signup', async (req, res) => {
//   let { email, password } = req.body;
//   let db = req.app.get('db');
//   let userFound = await db.check_user_exists([email]);
//   if(userFound[0]) {
//     return res.status(200).send('Email already exists');
//   }
//   let salt = bcrypt.genSaltSync(10);
//   let hash = bcrypt.hashSync(password, salt);
//   let createdUser = await db.create_user([email, hash]);
//   req.session.user = {id: createdUser[0].id, email: createdUser[0].email}
//   res.status(200).send(req.session.user);
// })

// app.post('/auth/login', async (req, res) => {
//   let {email, password} = req.body;
//   let db = req.app.get('db');
//   let userFound = await db.check_user_exists([email]);
//   if(!userFound[0]) {
//     return res.status(200).send('Incorrect email.')
//   }
//   let result = bcrypt.compareSync(password, userFound[0].user_password);
//   if(result) {
//     req.sessions.user = { id:userFound[0].id, email: userFound[0].email};
//     res.status(200).send(req.session.user);
//   } else {
//     return res.status(401).send('Incorrect email/password');
//   }
// });

// app.listen(SERVER_PORT, () => {
//   console.log(`Listening on port: ${SERVER_PORT}`);
// });

require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const massive = require('massive');

const app = express();
app.use(express.json());
let { SERVER_PORT, CONNECTION_STRING, SESSION_SECRET } = process.env;

app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

massive(CONNECTION_STRING).then(db => {
  app.set('db', db);
});

app.post('/auth/signup', async (req, res) => {
  let { email, password } = req.body;
  let db = req.app.get('db')
  let userFound = await db.customer_check([email]);
  if (userFound[0]) {
    return res.status(200).send('Email already exists')
  }
  let salt = bcrypt.genSaltSync(10);
  let hash = bcrypt.hashSync(password, salt);
  let createdUser = await db.create_customer([email, hash])
  req.session.user = { id: createdUser[0].id, email: createdUser[0].email }
  res.status(200).send(req.session.user)
});

app.post('/auth/login', async (req, res) => {
  let { email, password } = req.body;
  let db = req.app.get('db')
  let userFound = await db.check_user_exists(email)
  if (!userFound[0]) {
    return res.status(200).send('Incorrect email. Please try again.');
  }
  let result = bcrypt.compareSync(password, userFound[0].user_password)
  if (result) {
    req.session.user = { id: userFound[0].id, email: userFound[0].email }
    res.status(200).send(req.session.user)
  } else {
    return res.status(401).send('Incorrect email/password')
  }
});

app.listen(SERVER_PORT, () => {
  console.log(`Listening on port: ${SERVER_PORT}`)
});