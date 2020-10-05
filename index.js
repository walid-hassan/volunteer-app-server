const express = require('express')
const app = express()
const port = 5000;
const bodyParser = require('body-parser')
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
require('dotenv').config()


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bdq7m.mongodb.net/volunteer-app?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const categoriesCollection = client.db("volunteer-app").collection("categories");
  const userCollection = client.db("volunteer-app").collection("users");
  // perform actions on the collection object
  app.get('/allCategories', (req, res) => {
    categoriesCollection.find({})
    .toArray((err, documents) => {
      res.status(200).send(documents)
    })  
  })
  app.post('/addvalunteer', (req, res) => {
    const userInfo = req.body
    userCollection.insertOne(userInfo)
    .then( result => res.status(200).send(result))
  })
  app.get('/allUsers', (req, res) => {
    userCollection.find({})
    .toArray((err, documents) => {
      res.status(200).send(documents)
    })  
  })
  app.delete('/deleteUser/:id', (req, res) => {
    const id = req.params.id;
    userCollection.deleteOne({_id: ObjectId(id)})
    .then( result => res.status(200).send(result))
  })
  app.post('/addEvent', (req, res) => {
    const userInfo = req.body
    categoriesCollection.insertOne(userInfo)
    .then( result => res.status(200).send(result))
  })
  app.get('/events', (req, res) => {
    const userEmail = req.query.email;
    userCollection.find({email: userEmail})
        .toArray((err, documents) => {
          res.status(200).send(documents);
          })
 })
 app.delete('/deleteEvent/:id', (req, res) => {
  const id = req.params.id;
  userCollection.deleteOne({_id: ObjectId(id)})
  .then( (result) => res.status(200).send(result))
})
});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT)