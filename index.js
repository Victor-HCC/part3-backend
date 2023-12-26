import express, { json } from 'express';
import morgan from 'morgan';
import cors from 'cors';
const app = express();

const port = process.env.PORT || 3000;

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
  {
    id: 5,
    name: "Emily Davis",
    number: "222-333-4444",
  },
  {
    id: 6,
    name: "Chris Anderson",
    number: "555-777-8888",
  },
  {
    id: 7,
    name: "Linda Brown",
    number: "111-222-3333",
  },
  {
    id: 8,
    name: "Robert Miller",
    number: "777-888-9999",
  },
]


morgan.token('body', function(req, res) {
  return JSON.stringify(req.body);
});

app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons', (req, res) => {
  res.status(200).json(persons);
})

app.get('/info', (req, res) => {
  const total = persons.length;

  res.send(`
    <p>Phonebook has info for ${total} people</p>
    ${new Date()}
  `)
})

app.get('/api/persons/:id', (req, res) => {
  const { id } = req.params;
  const person = persons.find(person => person.id === Number(id))
  
  if(person) res.status(200).json(person)
  else res.status(404).end()
})

app.delete('/api/persons/:id', (req, res) => {
  const { id } = req.params;
  persons = persons.filter(person => person.id !== Number(id));
  res.status(204).end();
})

const isUnique = (name) => {
  return !persons.some(person => person.name.toLowerCase() === name.toLowerCase())
}

app.post('/api/persons', (req, res) => {
  const body = req.body;

  if(!body.name) {
    return res.status(400).json({
      error: 'name is required'
    })
  }
  if(!body.number) {
    return res.status(400).json({
      error: 'number is required'
    })
  }

  if(!isUnique(body.name)) {
    return res.status(400).json({
      error: 'name must be unique'
    })
  }

  const id = Math.floor(Math.random()*100000)
  const person = {
    id: id,
    name: body.name,
    number: body.number
  }
  persons = persons.concat(person)

  res.json(person)
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})