const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
app.use(express.static('dist'))
app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))

const port = process.env.PORT || 3001;


//Create a new token in morgan for request register
morgan.token('body', (req) => JSON.stringify(req.body));

//Configure morgan for use the new token
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/',(req,res)=>{
    res.send("<h1>Hello from express</h1>")
})


//Request for get all contacts
app.get('/api/persons',(req,res)=>{
     res.json(persons)  
})      

app.get('/info',(req,res)=>{
    let date = Date();
    let personsLength = persons.length;
    res.send(`
            Phonebook has info for ${personsLength} people <br/>
            ${date}
        `)
})

app.get('/api/persons/:id',(req,res)=>{
    let { id } = req.params;
    
    let person = persons.find(person => person.id === Number(id));
    
        if(person){
            res.send(person)    
        }else{
            res.status(404).send('The resource not found')
        }

  
    
})

app.delete('/api/persons/:id' , (req, res) => {
    let {id} = req.params;
    let index = persons.findIndex(person => person.id === Number(id))
   
    if (index !== -1) {
        
        persons.splice(index, 1);
        res.status(200).send('The resource has been deleted');
    } else {
        
        res.status(404).send('The resource was not found');
    }
})

app.post('/api/persons',(req,res)=>{
    let newPerson = req.body;
    if(newPerson.name && newPerson.number){
        let findContact = persons.some(person => person.name.toLowerCase() ===  newPerson.name.toLowerCase())
        if(findContact){
            return res.status(409).json({error : "The name must be unique"})
        }

       let id = Math.floor(Math.random() * 1000);
       newPerson.id = id;     
       persons.push(newPerson)
       res.status(201).json(newPerson)
    }else if(newPerson.name){
        res.status(400).json({error:'The phone number is required'})
    }else{
        res.status(400).json({error:'The name is required'})
    }
})

app.listen(port,()=>{
    console.log("Server ok...")
})
