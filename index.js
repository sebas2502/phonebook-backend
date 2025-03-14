const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person')

const app = express();
app.use(express.static('dist'))
app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))



const port = process.env.PORT || 3001;


const errorHandler = (error, request, response, next) => {
    
  
    if (error.name === 'ValidationError') {
        console.log("validation error: ",error)
      return response.status(400).json({ error: error.message})
    } 
  
    next(error)
  }
  app.use(errorHandler)

//Create a new token in morgan for request register
morgan.token('body', (req) => JSON.stringify(req.body));

//Configure morgan for use the new token
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));


//Get all contacts
app.get('/api/persons',(req,res)=>{
    Person.find({}).then(persons => {
        res.json(persons)
    })
})

//Insert new contact
app.post('/api/persons' , (req,res,next)=>{
    
    //Get content
    const body = req.body;
    
    if(body === undefined){
        return res.status(400).json({error : 'Content missing'})
    }

    const person = new Person({
        name : body.name,
        number : body.number
    })

    person.save()
    .then(savedPerson => {
        res.json(savedPerson)
    })
    .catch(error => {
       
       next(error)
    })

})

//Search an one contact
app.get('/api/persons/:id' , (req,res,next) => {
    const {id} = req.params;
    
    Person.findById(id)
      
      .then((person) => {
        if(person){
            res.json(person)
        }else{
            res.status(404).end()
        }
    })
      .catch(error => next(error))
})


//Delete contact
app.delete('/api/persons/:id' , (req,res,next)=>{
    const {id} = req.params;
    Person.findByIdAndDelete(id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => next(error))
})


//Update Contact
app.put('/api/persons/:id' , (req,res,next) => {
    const id = req.params.id;
    const body = req.body;
    const person = {name:body.name , number:body.number}
    Person.findByIdAndUpdate(id , person , {new:true})
        .then( personUpdated => {
           return res.json(personUpdated)
        })
        .catch(error => next(error))
})
app.use(errorHandler)

app.listen(port,()=>{
    console.log("Server ok...")
})
