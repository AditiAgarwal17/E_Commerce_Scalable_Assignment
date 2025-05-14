const { MongoClient } = require('mongodb');
const { Client } = require('@elastic/elasticsearch');

// MongoDB and Elasticsearch connection settings
const mongoUri = 'mongodb+srv://scalable-ecom:2ygQAro3ZIULnZ25@cluster0.t0apcqe.mongodb.net/?retryWrites=true&w=majority&appName=cluster0¸¸';
const mongoDbName = 'e-commerce';
const esClient = new Client({ node: 'http://localhost:9200' });

async function syncProducts() {
  const mongoClient = new MongoClient(mongoUri);
  try {
    // Connect to MongoDB
    await mongoClient.connect();
    const db = mongoClient.db(mongoDbName);
    const products = await db.collection('products').find({}).toArray();

    console.log(`Found ${products.length} products in MongoDB`);

    // Index each product into Elasticsearch
    for (const product of products) {
      const { _id, ...productWithoutId } = product;
      await esClient.index({
        index: 'products',
        id: _id.toString(),
        document: productWithoutId,
      });
      console.log(`Indexed product: ${_id}`);
    }

    console.log('All products synced to Elasticsearch ✅');

  } catch (error) {
    console.error('Error syncing products:', error);
  } finally {
    await mongoClient.close();
  }
}

syncProducts();
