const express = require("express")
const app = express()
const port = 3000
const Posts = require('./models/posts');
const multer = require('multer');
const path = require('path');
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

//config for multer
const storage = multer.diskStorage({
  destination: 'public/uploads/',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
}).single('filetoupload');

function checkFileType(file, cb) {
  const filetypes = /png|jpg|jpeg/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('ERROR : Images only !');
  }
}


//end configs


app.get('/', (req, res) => {
  //$result = select * from post; 
  res.render('blank');
})
app.get('/posts', async (req, res, next) => {
  try {
    let row = await Posts.getMultiple()
    res.render('Posts/index',{data:row.data});
  // res.json(row.data);
  } catch (err) {
    console.error(`Error while getting Posts `, err.message);
    next(err);
  }

})

app.post('/post/store',upload, async function (req, res, next) {
  try {
    let Postvalues = {
      title: req.body.title,
      descripton: req.body.descripton,
      image:req.file.filename
    };

    res.json(await Posts.create(Postvalues));
  } catch (err) {
    console.error(`Error while creating Post`, err.message);
    next(err);
  }
});

app.get('/post/create', (req, res) => {
  res.render('Posts/create');
})


app.get('/post/delete/:id', async function (req, res, next) {
  try {
   // console.log(req.params.id);
   res.json(await Posts.remove(req.params.id))
  } catch (err) {
    console.error(`Error while updating Post`, err.message);
    next(err);
  }
});

app.get('/post/edit/:id', async function (req, res, next) {
  try {
    let row = await Posts.getSingle(req.params.id)
    // res.json(row.data[0]);
   res.render('Posts/update',{data:row.data[0]});
  } catch (err) {
    console.error(`Error while updating Post`, err.message);
    next(err);
  }
});

app.post('/post/update/:id', async function (req, res, next) {
  try {
    let PostUpdateValues = {
      title:req.body.title,
      descripton:req.body.descripton
    }

    res.json(await Posts.update(req.params.id, PostUpdateValues));

  } catch (err) {
    console.error(`Error while updating Post`, err.message);
    next(err);
  }
});

app.post('/post/update-image/:id',upload, async function (req, res, next) {
  try {
    let PostUpdateValues = {
     image:req.file.filename,
    }

    res.json(await Posts.update_image(req.params.id, PostUpdateValues));

  } catch (err) {
    console.error(`Error while updating Post`, err.message);
    next(err);
  }
});




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})