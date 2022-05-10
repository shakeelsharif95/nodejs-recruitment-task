const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongo-memory-server");

const mongod = new MongoMemoryServer();


module.exports.connects = async ()=>{
  const uri = await mongod.getUri();
  const mongooseOpts = {
    useNewUrlParser :true,
    useUnifiedTopology:true,
    poolSize:30,
  }

  await mongoose.connect(uri,mongooseOpts);

}

module.exports.closeDatabase = async ()=>{
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
}

module.exports.clearDatabase = async ()=>{
  const collections = mongoose.connection.collection;
  for (const key in collections) {
    const collection = collection[key];
    await collection.deleteMany()
  }
}