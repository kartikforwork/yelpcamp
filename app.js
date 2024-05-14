if(process.env.NODE_ENV!=="production"){
    require('dotenv').config()
}

const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const session=require('express-session')
const flash=require('connect-flash')
const ExpressError = require('./utils/ExpressError')
const methodOverride = require('method-override')
const passport=require('passport')
const LocalStrategy=require('passport-local')
const User=require('./models/user')
const app = express()

const userRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const user = require('./models/user')

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname,'public')))
//
const dbUrl=process.env.DB_URL || 'mongodb://127.0.0.1:27017/yelp-camp'

const MongoDBStore=require("connect-mongo")

const sessionConfig={
    store:MongoDBStore.create({ mongoUrl: dbUrl }),
    name:'session',
    secret:process.env.SECRET || 'thisshouldbebettersecret',
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }
}

app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

// const dbUrl=process.env.DB_URL


mongoose.connect(dbUrl)
    .then(() => {
        console.log("connection open")
    })
    .catch(err => {
        console.log('on no error')
        console.log(err)
    })

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use((req,res,next)=>{
    res.locals.currentUser=req.user
    res.locals.success=req.flash('success')
    res.locals.error=req.flash('error')
    next()
})

app.use('/',userRoutes)
app.use('/campgrounds',campgroundRoutes)
app.use('/campgrounds/:id/reviews',reviewRoutes)

app.get('/', (req, res) => {
    res.render('home')
})

app.all('*', (req, res, next) => {
    next(new ExpressError('page not found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "something went wrong"
    res.status(statusCode).render('error', { err })
})

const port=process.env.PORT || 3000
app.listen(port, () => {
    console.log('serving on port 3000')
})  