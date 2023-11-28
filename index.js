const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// midleware
app.use(cors());
app.use(express.json());



const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.393ceno.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const propertiesCollection = client.db('realDB').collection('properties')
    const reviewsCollection = client.db('realDB').collection('reviews')
    const wishCollection = client.db('realDB').collection('wishs')

    app.get('/properties',async(req,res)=>{
        const result = await propertiesCollection.find().toArray();
        res.send(result)
    })

    // wish Collection
    app.get('/wishs', async (req, res) => {
      const email = req.query.email
      const query = { email: email }
      const result = await wishCollection.find(query).toArray()
      res.send(result)
    })
    app.post('/wishs', async (req, res) => {
      const cartItem = req.body
      const result = await wishCollection.insertOne(cartItem)
      res.send(result)
    })

    

    app.get('/reviews',async(req,res)=>{
        const result = await reviewsCollection.find().toArray();
        res.send(result)
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('real estate is standing')
})

app.listen(port,()=>{
    console.log(`estate server is runing:${port}`)
})