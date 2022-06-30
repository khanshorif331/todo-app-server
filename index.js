const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb')

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
		const collection = client.db('todo-app').collection('todos')
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

// client.connect(err => {
// 	console.log('DB connected successfully')
// 	const collection = client.db('test').collection('devices')
// 	// perform actions on the collection object
// 	client.close()
// })
