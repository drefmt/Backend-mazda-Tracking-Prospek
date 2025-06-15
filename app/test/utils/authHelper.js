const request = require("supertest");
const { app } = require("../../../server");

const loginUser = async () => {
  const register = { username: "andre", email: "andre@gmail.com" ,password: "andre", level: "sales" };
  const user = { username: "andre",password: "andre" };

  // Register user terlebih dahulu
  const registerResponse = await request(app).post("/api/users/register").send(register);
  if (registerResponse.statusCode !== 201 && registerResponse.statusCode !== 400) {
    console.error("Registrasi gagal:", registerResponse.body);
    throw new Error("Gagal register user");
  }

  // Login user setelah register
  const response = await request(app).post("/api/users/login").send(user);
  
  console.log("Response dari login:", response.body);

  if (response.statusCode !== 200) {
    console.error("Login gagal:", response.body);
    throw new Error("Gagal login user");
  }

  return response.body.token;
};

module.exports = { loginUser };
