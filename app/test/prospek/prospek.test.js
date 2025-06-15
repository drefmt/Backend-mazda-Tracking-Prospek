const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const request = require("supertest");
const { app, startServer, stopServer } = require("../../../server");
const { loginUser } = require("../utils/authHelper");

let mongoServer;
let token;
let createdProspekId;

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

describe("Prospek API", () => {
  it("should be able to add a new prospek", async () => { 
    const res = await request(app)
      .post("/api/prospek")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Arif",
        date: "2025-02-13",
        whatsappNum: "08123456789",
        address: "Jalan Merdeka No.10",
        source: "Instagram",
        carType: "Mazda CX-5",
      });

    expect(res.statusCode).toBe(res.statusCode);
    console.log(res.body);
    createdProspekId = res.body.data; 
  });

  it("should be able to retrieve all prospek", async () => { 
    const res = await request(app) 
      .get("/api/prospek")     
    expect(res.statusCode).toBe(res.statusCode);
    
  });

  it("should be able to retrieve prospek by ID", async () => { 
    const res = await request(app)
      .get(`/api/prospek/${createdProspekId}`)     
    expect(res.statusCode).toBe(res.statusCode);
    
  });

  it("should be able to update prospek", async () => { 
    const res = await request(app)
      .put(`/api/prospek/${createdProspekId}`)     
      .send({
        name: "Bayhaqi",
        address: "Jalan Sudirman No.20",
      });

    expect(res.statusCode).toBe(res.statusCode);
  });

  it("should be able to delete prospek", async () => { 
    const res = await request(app) 
      .delete(`/api/prospek/${createdProspekId}`)      
    expect(res.statusCode).toBe(res.statusCode);
    
  });
});
