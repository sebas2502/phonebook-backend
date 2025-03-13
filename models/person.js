const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config()



const password = process.env.password;
const url = `mongodb+srv://ricardo250297:${password}@cluster0.bqm9q.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set('strictQuery', false);
mongoose.connect(url)
  .then(result => {
    console.log('Connected to mongoDB')
  })
  .catch((error)=>{
    console.log('Error in the connection to mongo db : ' , error)
  });

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
});

const Person = mongoose.model('Person', personSchema);


//Modify the method toJson for format the exit
personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

module.exports = Person;
