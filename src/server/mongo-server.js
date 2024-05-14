import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://admin:FH0pwhCfwzYTZ2yn@cluster0.7qsbp6d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const databaseName = 'task_management';
const taskCollectionName = 'task_collection';

const client = new MongoClient(uri);

async function connectDB() {
  try {
    console.log('Trying to connect to the database...');
    await client.connect();
    console.log('Connected to the database successfully!');
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    throw error; // Rethrow the error to handle it in the calling function
  }
}

async function createCollection() {
  try {
    await connectDB(); // Ensure database connection before creating collection

    const db = client.db(databaseName);
    const collectionExists = await db.listCollections({ name: taskCollectionName }).hasNext();
    if (!collectionExists) {
      await db.createCollection(taskCollectionName);
      console.log(`Collection '${taskCollectionName}' created successfully!`);
    } else {
      console.log(`Collection '${taskCollectionName}' already exists.`);
    }
  } catch (error) {
    console.error('Failed to create collection:', error);
    throw error; // Rethrow the error to handle it in the calling function
  }
}

async function closeDBConnection() {
  try {
    console.log('Closing database connection...');
    await client.close();
    console.log('Database connection closed successfully!');
  } catch (error) {
    console.error('Failed to close database connection:', error);
    throw error; // Rethrow the error to handle it in the calling function
  }
}

async function getDbCollection() {
  try {
    const db = await client.db(databaseName);
    const taskCollection = await db.collection(taskCollectionName);  
    return { taskCollection };
  } catch (error) {
    console.error('Failed to get database collection:', error);
    throw error; // Rethrow the error to handle it in the calling function
  }
}


export { createCollection, closeDBConnection, getDbCollection };
