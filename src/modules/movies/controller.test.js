const request = require("supertest");
const app = require("../../server");
const { verifyToken, extractToken } = require("../../services/auth-service");
const ASYNC_TIMEOUT = 20000;

const login = () =>
  request(app).post("/auth").send({
    username: "basic-thomas",
    password: "sR-_pcoow-27-6PAwCD8",
  });

describe("Movie Endpoints", () => {
  const db = require('./db')
  beforeAll(async () => await db.connect())
  afterEach(async () => await db.clearDatabase())
  afterAll(async () => await db.closeDatabase())

  it("should check invalid username and password", async () => {
    const res = await request(app).post("/auth").send({
      username: "basic-thomass",
      password: "sR-_pcoow-27-6PAwCD238",
    });

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toEqual("invalid username or password");
  });

  it("should send a response token or simply log in", async () => {
    const res = await login();
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("token");
  });

  it(
    "should create a movie",
    async () => {
      const loginRes = await login();
      const token = loginRes.body.token;
      const res = await request(app)
        .post("/movie")
        .set({ Authorization: `Bearer ${token}` })
        .send({
          title: "avengers",
        });
      expect(res.statusCode).toEqual(201);
      console.log("body", res.body);
      expect(res.text).toEqual("Succesfully created");
    },
    ASYNC_TIMEOUT
  );

  it(
    "should get all movies",
    async () => {
      const loginRes = await login();
      const token = loginRes.body.token;
      const res = await request(app)
        .get("/movie")
        .set({ Authorization: `Bearer ${token}` });
      expect(res.statusCode).toEqual(200);
    },
    ASYNC_TIMEOUT
  );
});
