const mongoose = require("mongoose");
const request = require("supertest");
const { app, server } = require("../mainindex");
const jwt = require("jsonwebtoken");
const config = require("../config/db.config");
const Desafio = require("../models/desafio.model");
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
describe("Registar desafio", () => {
  test("Deve retornar sucesso ao criar um novo Desafio", async () => {
    const response1 = await request(app).post("/Ecopointer/users/login").send({
      username: "Carlos13",
      password: "teste",
    });

    expect(response1.status).toBe(200);

    // Acessar o token de acesso (accessToken)
    accessToken = response1.body.accessToken;
    const desafioData = {
      xp: 1100,
      recompensa: "caneta",
      objetivoDesafio: 15,
      estadoDesafio: 0,
      username: "teste",
      descDesafio: "Publicar fotos",
    };

    const response = await request(app)
      .post("/Ecopointer/challenges/challenge")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(desafioData)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.msg).toBe("New Desafio created.");
    expect(response.body.URL).toBeTruthy();
  });
  test("Deve retornar erro 400 se houver erros de validação ao criar um Desafio", async () => {
    const desafioData = {
      xp: "100",
      descDesafio: "",
      recompensa: "",
      objetivoDesafio: "",
      estadoDesafio: "",
      username: "",
    };

    const response = await request(app)
      .post("/Ecopointer/challenges/challenge")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(desafioData)
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.errors).toBeTruthy();
  });
  test("Deve retornar erro 401 se não fornecer token", async () => {
    const desafioData = {
      xp: "100",
      descDesafio: "",
      recompensa: "",
      objetivoDesafio: "",
      estadoDesafio: "",
      username: "",
    };

    const response = await request(app)
      .post("/Ecopointer/challenges/challenge")

      .send(desafioData)
      .expect(401);

    expect(response.body.success).toBe(false);
  });
});
describe("Procurar um desafio", () => {
  test("Deve retornar o Desafio corretamente ao pesquisar por um ID válido", async () => {
    const response = await request(app)
      .get(`/Ecopointer/challenges/challenge/6463b1ab29f06d905c7ecc79`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeTruthy();
  });
  test("Deve retornar erro 404 ao pesquisar por um ID de Desafio inexistente", async () => {
    const nonExistentId = "60c4c5e377cd661e3cfd85fd";

    const response = await request(app)
      .get(`/Ecopointer/challenges/challenge/${nonExistentId}`)
      .expect(404);

    expect(response.body.success).toBe(false);
    expect(response.body.msg).toBe(
      `Cannot find any Desafio with the ID ${nonExistentId}`
    );
  });
  test("Deve retornar erro 400 ao pesquisar por um ID inválido", async () => {
    const invalidId = "....";

    const response = await request(app)
      .get(`/Ecopointer/challenges/challenge/${invalidId}`)
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.msg).toBe("ID parameter is not a valid ObjectId");
  });
});
describe("obter todos os desafios", () => {
  test("Deve retornar todos os desafios", async () => {
    const response = await request(app).get("/Ecopointer/challenges/challenge");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});
describe("Update as desafios", () => {
  test("Deve atualizar o desafio com o ID fornecido", async () => {
    const updatedDesafio = {
      xp: 20,
      estadoDesafio: "Em andamento",
      user: "usuário2",
    };

    const response = await request(app)
      .put("/Ecopointer/challenges/challenge/648b283feb02be70a2bbcd1a")
      .send({
        descDesafio: "teste",
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.msg).toBe(
      `Desafio with ID 648b283feb02be70a2bbcd1a updated successfully`
    );
  });
  test("Deve retornar erro 400 se o id tiver um mau formato", async () => {
    // ID que não existe no banco de dados

    const response = await request(app)
      .put(`/Ecopointer/challenges/challenge/648b283feb02be70a2bbcd1`)
      .send({ xp: 20 });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.msg).toBe(`ID parameter is not a valid ObjectId`);
  });
  test("Deve retornar erro 404 se nao encontrar o desafio", async () => {
    // ID que não existe no banco de dados

    const response = await request(app)
      .put(`/Ecopointer/challenges/challenge/648b283feb02be70a2bbcd10`)
      .send({ xp: 20 });

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.msg).toBe(
      `Cannot update Desafio with ID 648b283feb02be70a2bbcd10`
    );
  });
});
describe("Apagar desafios", () => {
  test("Deve deletar o desafio com o ID fornecido", async () => {
   

    const response = await request(app).delete(`/Ecopointer/challenges/challenge/648b36af4d858d67807f3c43`)
    .set("Authorization", `Bearer ${accessToken}`);


    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.msg).toBe(
      `Desafio with ID 648b36af4d858d67807f3c43 deleted successfully`
    );

    
  });
  test("Deve deletar o desafio com o ID fornecido", async () => {
   

    const response = await request(app).delete(`/Ecopointer/challenges/challenge/648b36af4d858d67807f3c43`)
    .set("Authorization", `Bearer ${accessToken}`);


    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.msg).toBe(
      `Cannot delete Desafio with ID 648b36af4d858d67807f3c43`
    );

    
  });
   test('Deve retornar erro 403 se a solicitação não for feita por um usuário com função "admin"', async () => {
    const response1 = await request(app).post("/Ecopointer/users/login").send({
        username: "Carlos",
        password: "teste",
      });
  
      expect(response1.status).toBe(200);
  
      // Acessar o token de acesso (accessToken)
      accessToken = response1.body.accessToken;
   

    const response = await request(app).delete(`/Ecopointer/challenges/challenge/648b36af4d858d67807f3c43`)
    .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
    expect(response.body.msg).toBe('This request requires ADMIN role!');
  });
});
