const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config()



const password = process.env.PASSWORD;
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
    name: {
      type : String,
      minLength : 3,
      required : true
    },
    number: {
      type: String,
      validate: {
        validator: function(v) {
          return /\d{2}-\d{4}-\d{6}/.test(v);
        },
        message: props => `${props.value} is not a valid phone number!`
      },
      required: [true, 'User phone number required']
    }
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
