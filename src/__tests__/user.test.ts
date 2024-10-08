import request from "supertest";
import userController from "../app/controllers/user.controller";
import server from "../bootstrap/server";
import { AuthService } from "../app/services/user/auth.service";
import { User, UserAttributes } from "../app/models/user";
import { DataTypes, Model, Sequelize } from "sequelize";
import { database } from "../config/config";
import { Request } from "express";
import supertest from "supertest";
//import { bootstrap } from "..";
const service = new AuthService();
const app = server();
//server
beforeAll(async () => {
  await database.sync();
}, 80000);

afterAll(async () => {
  await database.close();
}, 80000);

const createUser = {
  id: 2,
  username: "elian",
  email: "elian@mail.com",
  password: "12345678",
};

const loginUser = {
  email: "elian@mail.com",
  password: "12345678",
};

const userPayload = {
  id: 2,
  username: "elian",
  email: "elian@mail.com",
  password: "12345678",
};

describe("testing authentication", () => {
  describe("authentication expect status Created (201)", () => {
    // it("given username, email and password for register", async () => {
    //   const res = await supertest(app)
    //     .post("/api/v1/auth/register")
    //     .send(createUser);
    //   expect(res.statusCode).toBe(201);
    // });
    it("given email and password for login", async () => {
      const res = await supertest(app)
        .post("/api/v1/auth/login")
        .send(loginUser);
      await supertest(app);
      //console.log(res.body)
      expect(res.statusCode).toBe(200);
    });
  });
  describe("given get user through jwt authentication expect status OK (200)", () => {
    it("get user", async () => {
      const res = await supertest(app)
        .post("/api/v1/auth/login")
        .send(loginUser);
      await supertest(app)
        .get("/api/v1/user/dashboard")
        .set("Authorization", `Bearer ${res.body.accessToken}`)
        .expect(200);
    });
  });
  describe("given user logout expect status OK (200)", () => {
    it("logout", async () => {
      const res = await supertest(app)
        .post("/api/v1/auth/login")
        .send(loginUser);
      await supertest(app)
        .post("/api/v1/auth/logout")
        .set("Authorization", `Bearer ${res.body.accessToken}`)
        .set("Cookie", [`refreshToken=${res.body.refreshToken}`])
        .expect(200);
    });
  });
});

describe("testing CRUD user", () => {
  describe("given all users expect OK (200)", () => {
    it("get all users", async () => {
      const res = await supertest(app)
        .post("/api/v1/auth/login")
        .send(loginUser);
      await supertest(app)
        .get("/api/v1/user/all")
        .set("Authorization", `Bearer ${res.body.accessToken}`)
        .expect(200);
    });
  });
  describe("given id number", () => {
    it("get detail user", async () => {
      const res = await supertest(app)
        .post("/api/v1/auth/login")
        .send(loginUser);
      await supertest(app)
        .get(`/api/v1/user/profile/${userPayload.id.toString()}`)
        .set("Authorization", `Bearer ${res.body.accessToken}`)
        .expect(200);
    });
    it("update user", async () => {
      const res = await supertest(app)
        .post("/api/v1/auth/login")
        .send(loginUser);
      await supertest(app)
        .put(`/api/v1/user/update/${userPayload.id.toString()}`)
        .set("Authorization", `Bearer ${res.body.accessToken}`)
        .send({
          username: userPayload.email,
          email: userPayload.email,
        })
        .expect(201);
    });
    it("delete user", async () => {
      const res = await supertest(app)
        .post("/api/v1/auth/login")
        .send(loginUser);
      await supertest(app)
        .delete(`/api/v1/user/delete/${userPayload.id.toString()}`)
        .set("Authorization", `Bearer ${res.body.accessToken}`)
        .expect(200);
    });
  });
});

const createUserError = {
  username: "test",
  email: "test@mail.com",
  password: "test",
};

const userLoginError = {
  email: "test@mail.com",
  password: "test",
};

describe("testing error authentication", () => {
  describe("authentication expect status, unprocessable content (422)", () => {
    it("given username, email and password for register, password should be more than 8 characters", async () => {
      const res = await supertest(app)
        .post("/api/v1/auth/register")
        .send(createUserError);
      expect(res.statusCode).toBe(422);
    });
    it("given email and password, user should be registered", async () => {
      const res = await supertest(app)
        .post("/api/v1/auth/login")
        .send(userLoginError);
      await supertest(app);
      //console.log(res.body)
      expect(res.statusCode).toBe(422);
    });
  });
  describe("given get user through jwt authentication, unathorized (401)", () => {
    it("get user", async () => {
      const res = await supertest(app)
        .post("/api/v1/auth/login")
        .send(userLoginError);
      await supertest(app)
        .get("/api/v1/user/dashboard")
        .set("Authorization", `Bearer ${res.body.accessToken}`)
        .expect(401);
    });
    describe("given CRUD without authorization, forbidden (403)", () => {
      it("get all users", async () => {
        const res = await supertest(app)
          .post("/api/v1/auth/login")
          .send(loginUser);
        await supertest(app).get("/api/v1/user/all").expect(403);
      });
    });
  });
});
