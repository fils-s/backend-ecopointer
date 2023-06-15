const mongoose = require("mongoose");
const request = require("supertest");
const { app, server } = require("../mainindex");
const jwt = require("jsonwebtoken");
const config = require("../config/db.config");
const User = require("../models/user.model");
const { log } = require("console");
let accessToken;

const database = config.URL;


beforeAll(async () => {
  await mongoose.connect(database, { useNewUrlParser: true });
  
});

afterAll(async () => {
  await mongoose.disconnect();
  server.close();
  
});

describe("Registar utilizador", () => {
  test("Todos os campos são obrigatórios", async () => {
    const response = await request(app).post("/Ecopointer/users/user").send({
      username: "",
      password: "",
      email: "",
      morada: "",
      IDcidade: "",
      xp: "",
      tipoUser: "",
      nome: " ",
    });
    expect(response.status).toBe(400);
  });

  test("Criar novo utilizador", async () => {
    const response = await request(app).post("/Ecopointer/users/user").send({
      username: "teste",
      password: "teste",
      email: "teste@gmail.com",
      morada: "teste",
      IDcidade: "teste",
      xp: "0",
      tipoUser: "user",
      nome: "teste",
    });
    expect(response.status).toBe(201);
  });
  test("Email inválido", async () => {
    // Create a user with an invalid email format
    const response = await request(app).post("/Ecopointer/users/user").send({
      username: "userwithinvalidemail",
      password: "password",
      email: "invalidemail",
      morada: "test address",
      IDcidade: "test city",
      xp: "0",
      tipoUser: "user",
      nome: "user with invalid email",
    });
    expect(response.status).toBe(400);
  });
});
describe("Login utilizador", () => {
  test("Email e Password são obrigatórios", async () => {
    const response = await request(app).post("/Ecopointer/users/login").send({
      username: "",
      password: "",
    });
    expect(response.status).toBe(400);
  });

  test("username não existe ou incorreto", async () => {
    const response = await request(app).post("/Ecopointer/users/login").send({
      username: "username",
      password: "password",
    });
    expect(response.status).toBe(404);
  });

  test("Password incorreta", async () => {
    const response = await request(app).post("/Ecopointer/users/login").send({
      username: "Carlos",
      password: "testepassword",
    });
    expect(response.status).toBe(401);
  });

  let authToken; // Variável para armazenar o token de autenticação

  test("Login com sucesso", async () => {
    const response = await request(app).post("/Ecopointer/users/login").send({
      username: "Carlos",
      password: "teste",
    });

    expect(response.status).toBe(200);

    // Acessar o token de acesso (accessToken)
    accessToken = response.body.accessToken;
  
  });
});

describe("Atualizar utilizador", () => {
  test("apenas o user pode atualizar os seus proprios dados", async () => {
    // Fazer a requisição utilizando o token no cabeçalho de autorização
    const response = await request(app)
      .put("/Ecopointer/users/user/6489e2f43e0c3a6ca66c5dcc")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        username: "",
        password: "",
      });

    expect(response.status).toBe(403);
  });
  test("update com sucesso", async () => {
    // Fazer a requisição utilizando o token no cabeçalho de autorização
    const response = await request(app)
      .put("/Ecopointer/users/user/64850c90ff46cfe044dd4c08")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        username: "Carlos",
      });

    expect(response.status).toBe(200);
  });
});
describe("BUSCAR USERS", () => {
  test("Buscar todos os usuários com sucesso", async () => {
    const response = await request(app)
      .get("/Ecopointer/users/user")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.users)).toBe(true);
  });

  test("nao fornecer token a ir buscar users", async () => {
    const response = await request(app).get("/Ecopointer/users/user");

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.msg).toBe("No token provided!");
  });
});
describe("BUSCAR USER EM ESPECIFICO", () => {
  test("Buscar usuário por ID com sucesso", async () => {
    const userId = "64850c90ff46cfe044dd4c08";

    const response = await request(app)
      .get(`/Ecopointer/users/user/${userId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.user).toBeDefined();
  });

  test("Usuário não encontrado por ID", async () => {
    const nonexistentId = "64850c90ff46cfe044dd4c09";

    const response = await request(app)
      .get(`/Ecopointer/users/user/${nonexistentId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.msg).toContain("Cannot find any user");
  });

  test("ID inválido fornecido", async () => {
    const invalidId = "invalid-id";

    const response = await request(app)
      .get(`/Ecopointer/users/user/${invalidId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.msg).toContain("ID parameter is not a valid ObjectId");
  });
});
describe("APAGAR USER", () => {
  test("Usuário não tem permissão para deletar (não-admin)", async () => {
    const userId = "64850c90ff46cfe044dd4c08";

    const response = await request(app)
      .delete(`/Ecopointer/users/user/${userId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
    expect(response.body.msg).toContain("This request requires ADMIN role");
  });
  test("Deletar usuário com sucesso (admin)", async () => {
    const userId = "648a454dde6cb3220776835a";
    const response1 = await request(app).post("/Ecopointer/users/login").send({
      username: "Carlos13",
      password: "teste",
    });

    expect(response1.status).toBe(200);

    // Acessar o token de acesso (accessToken)
    accessToken = response1.body.accessToken;

    const response = await request(app)
      .delete(`/Ecopointer/users/user/${userId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.msg).toContain(
      `User with ID ${userId} deleted successfully`
    );
  });

  test("Usuário não encontrado para deletar (admin)", async () => {
    const nonexistentId = "64850c90ff46cfe044dd4c09";

    const response = await request(app)
      .delete(`/Ecopointer/users/user/${nonexistentId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.msg).toContain(
      `Cannot delete user with ID ${nonexistentId}`
    );
  });

  
});
