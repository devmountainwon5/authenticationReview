const express = require('express')
const cors = require('cors')
const session = require('express-session')
const bodyParser = require('body-parser')
const massive = require('massive')
const bcrypt = require('bcrypt')
const app = express();
require('dotenv').config()

massive(process.env.DATABASE_URL)
    .then((dbInstance)=>{
        console.log('db is connected')
        app.set('db', dbInstance)
    })

app.use(bodyParser.json())
app.use(cors())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}))

//authentication middleware

app.use('/api/*', (req, res, next) => {
    //check to see if user is still logged in. 
    if(!req.session.user){
        res.send({success:false, message:'please login'})
    }else{
        next();
    }

})

//login endpoint
app.post('/auth/login', (req, res, next)=>{
    // get database context 
    const db = req.app.get('db');
    //Destructure things sent from the body.
    const {email, password} = req.body;
    //Check if the email corresponds to a user. 

    //Catch user
    let catchUser = {};

    db.user_table.findOne({email})
    .then((user)=>{
        if(!user){
            throw('No user for that email')
        }
        //Compare the password
        //user.password will be the hash. 
        catchUser = user;
        return bcrypt.compare(password, user.password )
    })
    .then((isMatch)=>{
        // handle bad password
        if(!isMatch){
            throw(`You're credentials don't match our records.`)
        }
        //prepare user for frontend
        delete catchUser.password

        req.session.user = catchUser;
        res.send({success:true, user:catchUser})
    })
    .catch((err)=>{
        res.send({success:false, err})
    })
})

// Register user 
app.post('/auth/register', (req, res, next)=>{
    // get database context 
    const db = req.app.get('db');
    //Destructure things sent from the body.
    const {email, password, first_name, last_name,username} = req.body;

    // Handle if user already exists.
    db.user_table.findOne({email})
    .then((user)=>{
        if(user){
            throw('user already exists. Please login')
        }
        //encypt password
        return bcrypt.hash(password, 10)
    })
    .then((hash)=>{
        // add user to database *Make sure to save hash as password
        return db.user_table.insert({email, password:hash, first_name, last_name,username})
    })
    .then((user)=>{
        //Prepare user object to send back to frontend and set session
        delete user.password
        req.session.user = user
        res.send({success:true, user})
    })
    .catch((err)=>{
        //handle all erros
        res.send({success:false, err})
    })
})

//Log out method. 
app.post('/auth/logout', (req, res, next)=>{
    // this destroys the session and removes the user object.
    req.session.destroy();
    res.send({success:true})
})

// Verify that the user is logged in. 
app.get('/auth/user', (req, res, next)=>{
    //check to see if the user object is set to the session.
    // send back true of false.  
    if(req.session.user){
        res.send({success:true})
    }else{
        res.send({success:false})
    }
   
})

app.get('/api/test', (req, res, next)=>{
    res.send({success:true, message:'This worked well'})
})



const port = process.env.PORT || 8700
app.listen(port, ()=>{
    console.log(`listening on port ${port}`)
})