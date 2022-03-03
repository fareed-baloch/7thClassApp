const express = require("express")
const app = express()
const port = 3000

//configs
//set the view engine to ejs
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
//end configs
  app.get('/', (req, res) => {
    //$result = select * from post; 
      res.render('blank');
    })
      app.get('/page', (req, res) => {
    //$result = select * from post; 
      res.render('page2');
    })
          app.get('/page3', (req, res) => {
    //$result = select * from post; 
      res.render('page3');
    })


  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})