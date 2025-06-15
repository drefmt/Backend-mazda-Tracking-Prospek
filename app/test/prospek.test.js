const setupTestDB = require("../utils/setupTestDB");
const { app } = require("../../server");
const request = require("supertest");

const testDb = setupTestDB();
let prospekId;

describe("Prospek API", () => {
  it("should be able to add a new prospek", async () => {
    const token = testDb.getToken();
    const res = await request(app)
      .post("/api/prospek").set("Authorization", `Bearer ${token}`).send({
        name: "Arif",
        date: "2025-02-13",
        whatsappNum: "08123456789",
        address: "Jalan Merdeka No.10",
        source: "Instagram",
        carType: "Mazda CX-5",
        status: "Prospek",
        category: "Hot",
      });

    expect(res.statusCode).toBe(201);           
    expect(res.body).toHaveProperty("data"); 
    expect(res.body).toHaveProperty("id"); 
    prospekId = res.body.data.id;
  });

  it("should be able to get all prospek", async () => {
    const res = await request(app).get("/api/prospek").set("Authorization", `Bearer ${token}`);  
    expect(res.statusCode).toBeGreaterThanOrEqual(200);    
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("should be able to get prospek by ID", async () => {
    expect(prospekId).toBeDefined();
    const res = await request(app).get(`/api/prospek/${prospekId}`)
    .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data.id).toBe(prospekId); 
    
  });

  it("should be able to update prospek", async () => {
    expect(prospekId).toBeDefined();

    const res = await request(app).put(`/api/prospek/${prospekId}`).send({
      name: "Bayhaqi",
      address: "Jalan Sudirman No.20",
    }).set("Authorization", `Bearer ${token}`);
    

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("data"); 
    expect(res.body.data.name).toBe("Bayhaqi");
  });

  it("should be able to delete prospek", async () => {
    expect(prospekId).toBeDefined();
    const res = await request(app).delete(`/api/prospek/${prospekId}`)
    .set("Authorization", `Bearer ${token}`);;
    expect(res.statusCode).toBe(200);    
  });

  it("should return 401 if no token provided", async () => {
    const res = await request(app).get("/api/prospek");
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("message", "Unauthorized");
  });
});
