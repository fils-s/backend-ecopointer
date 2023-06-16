const mongoose = require("mongoose");
const request = require("supertest");
const { app, server } = require("../mainindex");
const jwt = require("jsonwebtoken");
const config = require("../config/db.config");
const User = require("../models/user.model");
const { log } = require("console");
const db = require("../models");
const FAQ = db.faqs;
let accessToken;

let createFaq;
let newFaq;

const database = config.URL;

beforeAll(async () => {
  await mongoose.connect(database, { useNewUrlParser: true });
  const response1 = await request(app).post("/Ecopointer/users/login").send({
    username: "Carlos13",
    password: "teste",
  });

  expect(response1.status).toBe(200);
  console.log(response1);
  

  // Acessar o token de acesso (accessToken)
  accessToken = response1.body.accessToken;
  console.log(accessToken);
  const faq = new FAQ({
    nome: "Pergunta",
      descricao: "Resposta",
      type: "type",
  });

   newFaq = await faq.save();






 

console.log(  newFaq._id);
  console.log(newFaq)

  
});



afterAll(async () => {
  await FAQ.findByIdAndRemove(newFaq._id);
  await mongoose.disconnect();
  server.close();
});
describe("Criar uma nova faq", () => {
  test("Deve criar uma nova ajuda", async () => {
    const newFaqData = {
      nome: "Pergunta",
      descricao: "Resposta",
      type: "type",
    };

    const response = await request(app)
      .post("/Ecopointer/faqs/faq")
      .send(newFaqData);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.msg).toBe("New ajuda created.");
    expect(response.body.URL).toContain("/faq/");
  });
  test("Deve retornar erro 400 se houver erro de validação", async () => {
    const invalidFaqData = {
      nome: "",
      descricao: "Resposta",
      type: "type",
    };

    const response = await request(app)
      .post("/Ecopointer/faqs/faq")
      .send(invalidFaqData);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.msg).toBe("Validation error");
    expect(response.body.errors.nome).toBeDefined();
  });
});
describe("Buscar todas faqs", () => {
  test("Deve retornar todas as FAQs", async () => {
    const response = await request(app).get("/Ecopointer/faqs/faq");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});
describe("Buscar uma faq em especifico", () => {
  test("Deve retornar uma FAQ específica pelo ID", async () => {
    const response = await request(app).get(
      `/Ecopointer/faqs/faq/${newFaq._id}`
    );

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
  test("Deve retornar erro 404 ao buscar uma FAQ inexistente", async () => {
    const response = await request(app).get(
      "/Ecopointer/faqs/faq/6465383782c294ca213c9394"
    );

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.msg).toBe(
      "Cannot find any ajuda with the ID 6465383782c294ca213c9394"
    );
  });
  test("Deve retornar erro 400 ao buscar uma FAQ com ID inválido", async () => {
    const response = await request(app).get(
      "/Ecopointer/faqs/faq/6465383782c294ca213c9394}"
    );

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.msg).toBe("ID parameter is not a valid ObjectId");
  });
});
describe("Dar update duma faq", () => {
  test("Deve atualizar uma FAQ existente", async () => {
    const updatedFaq = {
      nome: "Nova Pergunta",
      descricao: "Nova Resposta",
      type: "type2",
    };

    const response = await request(app)
      .put(`/Ecopointer/faqs/faq/${newFaq._id}`)
      .send(updatedFaq);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.msg).toBe(
      `Ajuda with ID ${newFaq._id} updated successfully`
    );
  });
  test("Deve retornar erro 404 ao atualizar uma FAQ inexistente", async () => {
    const response = await request(app)
      .put("/Ecopointer/faqs/faq/6465383782c294ca213c9394")
      .send({
        nome: "Nova Pergunta",
        descricao: "Nova Resposta",
        type: "type2",
      });

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.msg).toBe(
      `Cant update ajuda with ID 6465383782c294ca213c9394`
    );
  });
  test("Deve retornar erro 400 ao atualizar uma FAQ com ID inválido", async () => {
    const response = await request(app)
      .put("/Ecopointer/faqs/faq/6465383782c294ca213c9394}")
      .send({
        nome: "Nova Pergunta",
        descricao: "Nova Resposta",
        type: "type2",
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.msg).toBe("ID parameter is not a valid ObjectId");
  });
});
describe("Apagar uma faq", () => {
  test("Deve excluir uma FAQ existente", async () => {
    const response1 = await request(app).post("/Ecopointer/users/login").send({
      username: "Carlos13",
      password: "teste",
    });

    expect(response1.status).toBe(200);

    // Acessar o token de acesso (accessToken)
    accessToken = response1.body.accessToken;
    const response = await request(app)
      .delete(`/Ecopointer/faqs/faq/${newFaq._id}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.msg).toBe(
      `Ajuda with ID ${newFaq._id} deleted successfully`
    );
  });
  test("Deve retornar erro 404 ao excluir uma FAQ inexistente", async () => {
    const response = await request(app)
      .delete("/Ecopointer/faqs/faq/648ba4ede510f44f57eb0270")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.msg).toBe(
      `Cannot delete Ajuda with ID 648ba4ede510f44f57eb0270`
    );
  });
  test("Deve retornar erro 403 ao excluir uma FAQ sem permissão de administrador", async () => {
    const response1 = await request(app).post("/Ecopointer/users/login").send({
      username: "Carlos",
      password: "teste",
    });

    expect(response1.status).toBe(200);

    // Acessar o token de acesso (accessToken)
    accessToken = response1.body.accessToken;

    const response = await request(app)
      .delete(`/Ecopointer/faqs/faq/648ba4ede510f44f57eb0270`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
    expect(response.body.msg).toBe("This request requires ADMIN role!");
  });
});
