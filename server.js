const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const morgan = require('morgan');
const methodOverride = require('method-override')
dotenv.config();

const app = express();


//middleware
app.use(express.urlencoded({extended: false}));
app.use(morgan('dev'));
app.use(methodOverride('_method'))

mongoose.connect(process.env.MONGODB_URL);
mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// Import the Fruit model
const Fruit = require("./models/fruit.js");

app.get('/', (req,res) =>{
   res.render('index.ejs');
})

//fruits
app.get('/fruits/new', (req,res) =>{
    res.render('fruits/new.ejs'); //if its a path and when using render do not put a '/' only for rout use '/'
})

app.post('/fruits' , async(req,res)=>{
    try{
        if(req.body.isReadyToEat === 'on'){
            req.body.isReadyToEat = true;
        }else{
            req.body.isReadyToEat = false;
        }

        await Fruit.create(req.body);
        res.redirect('/fruits')
    }catch(err){
        console.log(err);
        res.send('Failed to create');
    }
})

app.get('/fruits', async(req,res)=>{
    try{
        const fruits = await Fruit.find();
        res.render('fruits/index.ejs',{fruits});

    }catch(err){
        console.log(err);
        res.send('Failed to get all fruits')
    }
})

app.get('/fruits/:id', async(req,res)=>{
    try{
        const fruit = await Fruit.findById(req.params.id);
        res.render("fruits/show.ejs", { fruit: fruit })

    }catch(err){
        console.log(err);
        res.send('Failed to fetch the fruit');
    }
})

app.delete('/fruits/:id', async(req,res)=>{
    try{
        await Fruit.findByIdAndDelete(req.params.id);
        res.redirect('/fruits')

    }catch(err){
        console.log(err);
        res.send('fruit cant be deleted!')
    }
})

app.get('/fruits/:id/edit', async(req,res)=>{
    try{
        const fruit = await Fruit.findById(req.params.id);
        res.render('fruits/edit.ejs', {fruit});
    }catch(err){
        console.log(err)
        res.send('unable to update the fruit');
    }
})

app.put('/fruits/:id', async(req,res)=>{
    try{
        if(req.body.isReadyToEat === 'on'){
            req.body.isReadyToEat = true;
        }else{
            req.body.isReadyToEat = false;
        }

        await Fruit.findByIdAndUpdate(req.params.id, req.body)
        res.redirect(`/fruits/${req.params.id}`);
    }catch(err){
        console.log(err)
        res.send('unable to update the fruit')
    }
})


app.listen(3000, () => {
  console.log('Listening on port 3000');
});