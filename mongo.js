import mongoose from "mongoose";
import 'dotenv/config';

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const USER = process.env.USER

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];


const url =
`mongodb+srv://${USER}:${password}@cluster0.awirpst.mongodb.net/phonebook?retryWrites=true&w=majority`

const connect = async () => {
  mongoose.connect(url)
}

connect()

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if(!name && !number) {
  Person
  .find({})
  .then(persons=> {
    console.log('Phonebook:');
    persons.map(person => {
      console.log(`${person.name} ${person.number}`);
    })
    mongoose.connection.close()
  })
} else {
  const person = new Person({
    name: `${name}`,
    number: `${number}`,
  })
  
  person.save().then(result => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
}
