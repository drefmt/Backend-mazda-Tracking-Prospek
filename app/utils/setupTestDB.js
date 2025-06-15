const { startServer, stopServer } = require("../../server");
const { loginUser } = require("../utils/authHelper");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const setupTestDB = () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    await mongoose.connect(mongoUri);
    await startServer();

    token = await loginUser();
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
    await stopServer();
  });

  return { getToken: () => token };
};

module.exports = setupTestDB;
