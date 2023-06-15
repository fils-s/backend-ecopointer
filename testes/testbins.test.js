const mongoose = require("mongoose");
const request = require("supertest");
const { app, server } = require("../mainindex");
const jwt = require("jsonwebtoken");
const config = require("../config/db.config");
const Ecoponto = require("../models/ecoponto.model");
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
describe("testar criar ecoponto", () => {
  test("create com sucesso", async () => {
    const response1 = await request(app).post("/Ecopointer/users/login").send({
      username: "Carlos",
      password: "teste",
    });

    expect(response1.status).toBe(200);

    // Acessar o token de acesso (accessToken)
    accessToken = response1.body.accessToken;
    // Dados do novo ecoponto de teste
    const localizacao = { latitude: 123.456, longitude: 789.012 };
    const descricao = "Descrição do novo ecoponto";
    const imagem = "URL_da_imagem.png";

    // Fazer a requisição utilizando o token no cabeçalho de autorização
    const response = await request(app)
      .post("/Ecopointer/bins/bin")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        localizacao: localizacao,
        descricao: descricao,
        imagem: imagem,
      });

    // Verificações
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.msg).toBe("New Ecoponto created.");
    expect(response.body.URL).toContain("/ecoponto/");
  });
  test("Deve retornar erro 400 se os dados do Ecoponto forem inválidos", async () => {
    const novoEcoponto = {
      localizacao: "Localização do Ecoponto",
      // descrição está faltando, o que deve resultar em um erro de validação
      imagem: "URL da imagem do Ecoponto",
    };

    const resposta = await request(app)
      .post("/Ecopointer/bins/bin")
      .send(novoEcoponto)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(400);

    expect(resposta.body.success).toBe(false);
    expect(resposta.body.errors.descricao).toBe("Descrição field is mandatory");
  });
  test("Deve retornar erro 401 ao fornecer um usuário não autenticado", async () => {
    const response = await request(app).post("/Ecopointer/bins/bin").send({
      localizacao: "Localização do Ecoponto",
      descricao: "Descrição do Ecoponto",
      imagem: "URL da imagem do Ecoponto",
      // Fornecer valores válidos
    });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });
});
describe("Testes para BUSCAR TODOS USERS", () => {
  test("Deve retornar todos os Ecopontos quando não for fornecido um ID", async () => {
    const response = await request(app)
      .get("/Ecopointer/bins/bin")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.ecoponto).toBeTruthy();
    expect(Array.isArray(response.body.ecoponto)).toBe(true);
  });
  test("nao fornecer token a ir buscar ecopontos", async () => {
    const response = await request(app).get("/Ecopointer/bins/bin");

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.msg).toBe("No token provided!");
  });
});
describe("Testes para is buscar um ecoponto ", () => {
  test("Deve retornar o Ecoponto correto quando um ID válido for fornecido", async () => {
    const ecopontoId = "648998cbe8acd26276577160"; // Fornecer um ID válido aqui

    const response = await request(app)
      .get(`/Ecopointer/bins/bin/${ecopontoId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.ecoponto).toBeTruthy();
    expect(response.body.ecoponto._id).toBe(ecopontoId);
  });
  test("Deve retornar erro 404 quando o ID do Ecoponto não for encontrado", async () => {
    const ecopontoId = "648998cbe8acd26276577161"; // Fornecer um ID que não exista

    const response = await request(app)
      .get(`/Ecopointer/bins/bin/${ecopontoId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.msg).toBeTruthy();
  });
  test("Deve retornar erro 400 quando o ID fornecido não for válido", async () => {
    const invalidId = "______"; // Fornecer um ID inválido aqui

    const response = await request(app)
      .get(`/Ecopointer/bins/bin/${invalidId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.msg).toBeTruthy();
  });
  test("nao fornecer token a ir buscar o ecoponto", async () => {
    const ecopontoId = "648998cbe8acd26276577160";
    const response = await request(app).get(
      `/Ecopointer/bins/bin/${ecopontoId}`
    );

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.msg).toBe("No token provided!");
  });
});
describe("Testes de update de ecoponto ", () => {
  test("Deve retornar sucesso ao atualizar o Ecoponto com um ID válido", async () => {
    const ecopontoId = "648b15154a7f9460163e6b8d";
    const newData = {
      descricao: "ecoponto4",
    };

    const response = await request(app)
      .put(`/Ecopointer/bins/bin/648b15154a7f9460163e6b8d`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send(newData);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.msg).toBe(
      "Ecoponto with ID 648b15154a7f9460163e6b8d updated successfully"
    );
  });
  test("Deve retornar erro 404 quando não ecnontrar o ecoponto", async () => {
    const invalidId = "__________"; // Fornecer um ID inválido aqui
    const newData = {
      localizacao: "Nova localização",
      descricao: "Nova descrição",
      utilizacao: 10,
      imagem: "nova-imagem.jpg",
    };

    const response = await request(app)
      .put(`/Ecopointer/bins/bin/${invalidId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send(newData);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.msg).toBeTruthy();
  });
});
describe("Testes de update de ecoponto ", () => {
  test("Deve retornar erro 403 quando o usuário não for um administrador", async () => {
    const response = await request(app)
      .delete("/Ecopointer/bins/bin/648b15154a7f9460163e6b8d")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
    expect(response.body.msg).toBeTruthy();
  });
  test("Deve retornar sucesso ao excluir o Ecoponto com um ID válido", async () => {
    const response1 = await request(app).post("/Ecopointer/users/login").send({
      username: "Carlos13",
      password: "teste",
    });

    expect(response1.status).toBe(200);

    // Acessar o token de acesso (accessToken)
    accessToken = response1.body.accessToken;

    // Simular um usuário administrador

    const response = await request(app)
      .delete(`/Ecopointer/bins/bin/648b1b2c1bb98df1daed7cdc`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.msg).toBeTruthy();
  });
  test("Deve retornar erro 404 quando o Ecoponto não for encontrado", async () => {
    const response = await request(app)
      .delete(`/Ecopointer/bins/bin/648b1b2c1bb98df1daed7cdc`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.msg).toBeTruthy();
  });
});
describe("Testes de adicionar utilização ao  ecoponto ", () => {
  test("Deve retornar erro 500 porque não da para adicionar post", async () => {
    const response = await request(app)
      .put("/Ecopointer/bins/bin/post/648b215b2c33a0e5d63040e")
      .set("Authorization", `Bearer ${accessToken}`)

      .send({ imagem:"teste.png",
               data: "2023-05-05"})
      .expect(500);

    expect(response.body.msg).toBe(
      "Error uploading post of this Ecoponto: Cast to ObjectId failed for value \"648b215b2c33a0e5d63040e\" (type string) at path \"_id\" for model \"ecoponto\"")
    
  });
  test("Deve retornar sucesso ", async () => {
    const response = await request(app)
      .put("/Ecopointer/bins/bin/post/648b215b2c33a0e5d63040ef")
      .set("Authorization", `Bearer ${accessToken}`)

      .send({ imagem:"teste.png",
               data: "2023-05-05"})
      .expect(200);

    expect(response.body.msg).toBe(
      "Ecoponto with ID 648b215b2c33a0e5d63040ef updated successfully"
    );
  });
});
