const express = require("express")
const app = express()
const port = 3000
const Posts = require('./models/posts');

//configs
//set the view engine to ejs

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
//end configs


  app.get('/', (req, res) => {
    //$result = select * from post; 
      res.render('blank');
    })
     app.get('/posts', async (req, res,next) => {
     try {
            res.json(await Posts.getMultiple());
          } catch (err) {
            console.error(`Error while getting Posts `, err.message);
            next(err);
          }
      
    })

    


  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})