const Express= require('express');
const cors= require('cors');
const bodyParser= require('body-parser');
const mongoose = require('mongoose');


const app = Express();
app.use(cors());

 

  

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
require('dotenv').config();

//connection to mongoDB
mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser:true,
    useUnifiedTopology:true
},()=>{
    console.log('connected to mongoDB');
})
//creating a Schema
const mewting= new mongoose.Schema({
    name:String,
    content:String,
    created: Date
})
//exporting schema and naming in mongoDB 
const data= mongoose.model('mewData', mewting);

app.get('/',(req,res)=>{
    res.send('hello')

})

function isValidMew(mew){
    return  mew.name && mew.name.toString().trim() !=='' &&
            mew.content && mew.content.toString().trim() !==''

}
// app.use(limiter);

app.get('/mews',(req,res)=>{
    data
    .find()
    .then(mews=>{
        res.json(mews);
    })
})
app.post('/mews',async(req,res)=>{
    if(isValidMew(req.body)){
        //insert to db
        var name= req.body.name;
        var content=req.body.content;        
        
        //creating new mew
        const addedMew = new data({
            name:name,
            content:content
        });
        
       await addedMew.save((err)=>{
            if(err){
                return handelError(err);
            }
        })
        res.json(addedMew);
    }else{
        res.status(422);
        res.json({
            message:'Hey! Name and content required!'
        })

    }
})
app.listen(5000, ()=>{
    console.log('listning on port 5000')
})