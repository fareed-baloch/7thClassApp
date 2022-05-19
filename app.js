const express = require("express")
require('dotenv').config()


const app = express()
function Islogged(req,res,next){
    req.user ? next() : res.redirect('/login');
}
const port = process.env.SERVER_PORT
const Posts = require('./models/posts');//Posts Model
const Users = require('./models/users'); 
const multer = require('multer');//For Uploading Files
const path = require('path');//For Accessing Files On the Server 
const cors = require('cors'); // using Cors for Api Calls 
var nodemailer = require('nodemailer');
const session = require('express-session');
const flash = require('connect-flash');
require('./config/auth');
const passport = require('passport');

const Report = require('fluentReports' ).Report;


async function Isadmin(req,res,next){
  let UserTypeResult = await Users.getType(req.user.id)
    let UserType = UserTypeResult.data[0].type;
  //is user admin
    if(UserType == 1){
      next();
    }else{
      res.redirect('/usertype')
    }

}


//configs

//express session middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: true
}));
//passport middleware
  app.use(passport.initialize());
  app.use(passport.session());

//flash messages
app.use(flash());

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.static(__dirname + '/public')); //Making Static Folder for Resources
//set the view engine to ejs
app.set('view engine', 'ejs');//Seting View Engine To EJS

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
}).single('filetoupload');//using Single File 

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
//Multer Config End

app.use(cors())//Used for Api Calls From Other Applications

//node mailer Config

var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.GMAIL_ID,
        pass: process.env.GMAIL_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
});


//connect flash middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});


//end configs



app.get('/', (req, res) => {
  res.render('blank');
})

app.get('/posts',Islogged, async (req, res, next) => {
  try {
    let row = await Posts.getMultiple()
    let userdata = req.user;
    console.log(userdata.picture);
    res.render('Posts/index',{data:row.data,userdata:req.user});
  } catch (err) {
    console.error(`Error while getting Posts `, err.message);
    next(err);
  }
})
app.get('/usertype',Islogged , async(req,res,next)=>{

  res.send('User is type User')
})

app.get('/admintype',Islogged ,Isadmin, async(req,res,next)=>{
   res.send('User is type Admin')
})

app.get('/api/posts', async (req, res, next) => {
  try {
    let row = await Posts.getMultiple()
    //res.render('Posts/index',{data:row.data});
    res.status(200).send({data:row.data})
  } catch (err) {
    res.status(404).send({message:'error'})
    next(err);
  }
})


app.get('/api/post/:id', async (req, res, next) => {
  try {
    let id = req.params.id;
    let row = await Posts.getSingle(id);
    //res.render('Posts/index',{data:row.data});
    res.status(200).send({data:row.data})
  } catch (err) {
    res.status(404).send({message:'error'})
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

    let Result = await Posts.create(Postvalues);
    req.flash('success','Post Created');
    res.redirect('/posts')
  } catch (err) {
    console.error(`Error while creating Post`, err.message);
    next(err);
  }
});

app.put('/api/post/store',upload, async function (req, res, next) {
  try {
    let Postvalues = {
      title: req.body.title,
      descripton: req.body.descripton,
      image:req.file.filename
    };

    res.status(201).send(await Posts.create(Postvalues));
  } catch (err) {
    res.status(404).send({message:'Post not Created'});
    next(err);
  }
});

app.get('/sendmail', (req, res, next) => {
    res.render('Posts/sendmail');
})

app.post('/sendmail',function (req, res, next) {

    let Emailvalues = {
      to: req.body.email,
      title: req.body.title,
      descripton: req.body.descripton
    };
    var mailOptions = {
    from: 'underhacker1249@gmail.com',
    to: Emailvalues.to,
    subject: Emailvalues.title,
    text: 'Hello world',
    html: Emailvalues.descripton
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
        console.log(error);
    } else {
        console.log('Message sent: ' + info.response);
    }
    transporter.close();
});
  res.redirect('/')

});

app.get('/post/create', (req, res) => {
  res.render('Posts/create');
})


app.get('/post/delete/:id', async function (req, res, next) {
  try {
   let Result =  await Posts.remove(req.params.id);
   req.flash('danger','Post Removed !')
   res.redirect('/posts')
  } catch (err) {
    console.error(`Error while updating Post`, err.message);
    next(err);
  }
});


app.get('/post/edit/:id', async function (req, res, next) {
  try {
    let row = await Posts.getSingle(req.params.id)
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
    let Result = await Posts.update(req.params.id, PostUpdateValues);
    req.flash('info','Post Upated!')
    res.redirect('/post/edit/'+req.params.id)
  } catch (err) {
    console.error(`Error while updating Post`, err.message);
    next(err);
  }
});

app.patch('/api/post/update/:id', async function (req, res, next) {
  try {
    let PostUpdateValues = {
      title:req.body.title,
      descripton:req.body.descripton
    }
   // console.log(PostUpdateValues);
    //res.status(200).send({data : PostUpdateValues});
    res.status(200).send(await Posts.update(req.params.id, PostUpdateValues));
  } catch (err) {
     res.status(204).send({message: err.message});
    next(err);
  }
});

app.delete('/api/post/delete/:id', async function (req, res, next) {
 try {
   res.json(await Posts.remove(req.params.id))
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
   let Result = await Posts.update_image(req.params.id, PostUpdateValues);
   res.redirect('/posts');
  } catch (err) {
    console.error(`Error while updating Post`, err.message);
    next(err);
  }
});


//here
app.get('/redirect/auth',Islogged , async(req,res,next)=>{

  let UserTypeResult = await Users.getType(req.user.id)
    let UserType = UserTypeResult.data[0].type;
    if(UserType == 1)
    {
      res.redirect('/admintype');
    }
      if(UserType == 2)
    {
      res.redirect('/usertype');
    }

})

app.get('/report', async  function(req,res){
        let rows = await Posts.getMultiple();

     // var randomNumber = Math.floor(Math.random());
      const rpt = new Report("file.pdf")      
          .data( rows.data )									 // Add our Data
          .pageHeader( ["Posts"] )    		 // Add a simple header          
          .detail([['title', 100],['des', 200]])      // Put how we want to print out the data line.
          .render(); 	
        res.download("file.pdf")

});





app.get('/login', (req,res)=>{
  res.render('login')
});

app.get('/auth/google',
  passport.authenticate('google', { scope:
      [ 'email', 'profile' ] }
));


app.get( '/auth/google/callback',
    passport.authenticate( 'google', {
        successRedirect: '/redirect/auth',
        failureRedirect: '/login'
}));

app.get('/logout',(req,res)=>{
  req.logout();
  res.redirect('/login')
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})