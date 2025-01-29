require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { urlencoded } = require('body-parser');
const dns = require('dns')
const urlP = require('url')
const app = express();
const mongoose = require("mongoose");
const { url } = require('inspector');

mongoose.connect("mongodb+srv://lc:passwordA1@cluster0.rpje0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", { useNewUrlParser: true, useUnifiedTopology: true })

urlSchema = mongoose.Schema({
  urlInput: {type: String, required: true, unique: true},
  urlNum: {type: Number, required: true, unique: true}
})
let urlUnit = mongoose.model('urlUnit', urlSchema)

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));
app.use(urlencoded({extended: true}))

/*const findPeopleByName = async (personName) => {
  let goal = await urlUnit.find({urlInput: personName})
  return goal
  //done(null , data);
};*/




app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});



// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});
let urls = {}
let urlNum = 1
app.post('/api/shorturl/', (req, res) => {
  let dataInput = req.body.url
  let y = urlP.parse(dataInput)
    
  dns.lookup(y.hostname, (err, address) => {
    if (!address) {
      res.json({ error: 'invalid url' })}
    else  { 
      urlUnit.findOne({urlInput: dataInput})
      .then((entry) => {
        if (entry) {
          console.log("STALITE: " + entry.urlInput)
          res.json({
            original_url: entry.urlInput,
            short_url: entry.urlNum
          })
        }
         else {
            let newNum;
            urlUnit.find({})
            .sort({urlNum: 'desc'})
            .limit(1)
            .then((last) => {newNum = parseInt(last[0].urlNum) + 1
              let entry = new urlUnit({
                urlInput: dataInput,
                urlNum: newNum
              })
              entry.save()
              console.log("FRESHER: " + last.urlInput)

              res.json({
                original_url: entry.urlInput,
                short_url: entry.urlNum
              })})
          }
      })


      }
              
    })
    


})
  

app.get('/api/shorturl/:id', (req, res) => {
  let d = req.params.id;
  urlUnit.findOne({urlNum: d})
  .then((select)=> {res.redirect(select.urlInput)})
  
  
} )

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
