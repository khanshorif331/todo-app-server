const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')

// middlewares
app.use(express.json())
app.use(cors())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zcuoy.mongodb.net/?retryWrites=true&w=majority`
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	serverApi: ServerApiVersion.v1,
})

async function run() {
	try {
		await client.connect()
		console.log('Database Connected')
		const todoCollection = client.db('todo-app').collection('todos')
		const userCollection = client.db('todo-app').collection('users')

		// finding todo items according email
		app.get('/todos/:email', async (req, res) => {
			const email = req.params.email
			const query = { user: email }
			const result = await (
				await todoCollection.find(query).toArray()
			).reverse()
			res.send(result)
		})

		// adding new todo item
		app.post('/todo', async (req, res) => {
			const data = req.body
			const result = await todoCollection.insertOne(data)
			res.send(result)
		})

		// deleting todoItem by id
		app.delete('/todo/:id', async (req, res) => {
			const id = req.params.id
			console.log(req.params)
			const query = { _id: ObjectId(id) }
			const result = await todoCollection.deleteOne(query)
			res.send(result)
		})

		app.put('/user/:email', async (req, res) => {
			const email = req.params.email
			const user = req.body
			const filter = { email: email }
			const options = { upsert: true }
			const updateDoc = {
				$set: user,
			}
			const result = await userCollection.updateOne(
				filter,
				updateDoc,
				options
			)
			res.send({ result })
		})
	} finally {
	}
}

run().catch(console.dir)

app.get('/', (req, res) => {
	res.send('Welcome to the TODO app server.!')
})

app.listen(port, () => {
	console.log('Server is running on port', port)
})
