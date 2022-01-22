const mongoose = require("mongoose");
mongoose.set("useCreateIndex", true);
mongoose.promise = global.Promise;

async function removeAllCollections() {
  const collections = Object.keys(mongoose.connection.collections);
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName];
    await collection.deleteMany();
  }
}

async function dropAllCollections() {
  const collections = Object.keys(mongoose.connection.collections);
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName];
    await collection.drop();
  }
}

function testDbSetUp() {
  afterEach(async () => {
    await removeAllCollections();
  });
  afterAll(async () => {
    await dropAllCollections();
    await mongoose.connection.close();
  });
}

module.exports = {
  testDbSetUp,
};
