const mongoose = require("mongoose");
const request = require("supertest");
const { app, server } = require("../mainindex");
const jwt = require("jsonwebtoken");
const config = require("../config/db.config");
const { log } = require("console");
const db = require("../models");
const Evento = db.eventos;

let accessToken;
let createEvent;
let newEvent;

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
  const evento = new Evento({
    nome: "Apanhar lixo",
        descricao: "Apanhar lixo na praia",
        cidade: "Vida do Conde",
        data: "06-10-2023",
        imagem: "teste.png",
        gostos: 0,
        user: response1.id,
  });

   newEvent = await evento.save();






 

console.log(  newEvent._id);
  console.log(newEvent)

  
});



afterAll(async () => {
  await Evento.findByIdAndRemove(newEvent._id);
  await mongoose.disconnect();
  server.close();
});
describe("Registar Evento", () => {
  test("Deve criar um novo evento", async () => {
    const response1 = await request(app).post("/Ecopointer/users/login").send({
      username: "Carlos13",
      password: "teste",
    });

    expect(response1.status).toBe(200);

    // Acessar o token de acesso (accessToken)
    accessToken = response1.body.accessToken;
    const evento = {
      nome: "Apanhar lixo",
          descricao: "Apanhar lixo na praia",
          cidade: "Vida do Conde",
          data: "06-10-2023",
          imagem: "teste.png",
          gostos: 0,
          user: response1.id,
    
    }
    const response = await request(app)
      .post("/Ecopointer/events/event")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(evento);
console.log(response.body.errors);
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.msg).toBe("New Evento created.");
    expect(response.body.URL).toContain("/evento/");
  });
  test("Deve retornar erro 400 se houver erros de validação", async () => {
    const eventoData = {
      nome: "", // Nome vazio, o que resultará em um erro de validação
      descricao: "Descrição do Evento 1",
      cidade: "Cidade 1",
      data: "2023-06-30",
      imagem: "imagem.jpg",
    };

    const response = await request(app)
      .post("/Ecopointer/events/event")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(eventoData);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.msg).toBe("Validation error");
    expect(response.body.errors).toHaveProperty("nome");
  });
});
describe("Buscar todos os eventos", () => {
  test("Deve retornar todos os eventos", async () => {
    const response = await request(app)
      .get("/Ecopointer/events/event")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});
describe("Buscar um evento", () => {
    test('Deve retornar o evento com o ID fornecido', async () => {
       
    
        const response = await request(app).get(`/Ecopointer/events/event/${newEvent._id}`);
    
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
       
      });
      test('Deve retornar erro 404 se o evento não for encontrado', async () => {
        const eventoId = '648b3cf4be1d7dd8efead2e1'; // ID inválido
    
        const response = await request(app).get(`/Ecopointer/events/event/${eventoId}`);
    
        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.msg).toBe(`Cannot find any Evento with the ID ${eventoId}`);
      });
      test('Deve retornar erro 400 se o ID não for um ObjectId válido', async () => {
        const eventoId = '648b3cf4be1d7dd8efead2e1}'; // ID inválido
    
        const response = await request(app).get(`/Ecopointer/events/event/${eventoId}`);
    
        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.msg).toBe('ID parameter is not a valid ObjectId');
      });
    
    });
    describe("Update ao evento", () => {
        test('Deve atualizar o evento com o ID fornecido', async () => {
       
        
            const updatedEvento = {
              nome: 'Novo Nome',
              descricao: 'Nova Descrição',
              cidade: 'Nova Cidade',
              data: '2023-07-02',
              imagem: 'nova-imagem.jpg',
              gostos: 20,
              user: 'novo-usuário',
            };
        
            const response = await request(app)
              .put(`/Ecopointer/events/event/${newEvent._id}`)
              .send(updatedEvento);
        
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.msg).toBe(`Evento with ID ${newEvent._id} updated successfully`);
        
            
          });
          test('Deve retornar erro 404 se o evento não for encontrado para atualização', async () => {
            const eventoId = '648b3cf4be1d7dd8efead2e1'; // ID inválido
        
            const updatedEvento = {
              nome: 'Novo Nome',
              descricao: 'Nova Descrição',
              cidade: 'Nova Cidade',
              data: '2023-07-02',
              imagem: 'nova-imagem.jpg',
              gostos: 20,
              user: 'novo-usuário',
            };
        
            const response = await request(app)
              .put(`/Ecopointer/events/event/${eventoId}`)
              .send(updatedEvento);
        
            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(response.body.msg).toBe(`Cannot update Evento with ID ${eventoId}`);
          });
          test('Deve retornar erro 400 se o ID não for um ObjectId válido', async () => {
            const eventoId = '648b3cf4be1d7dd8efead2e1}'; // ID inválido
        
            const updatedEvento = {
              nome: 'Novo Nome',
              descricao: 'Nova Descrição',
              cidade: 'Nova Cidade',
              data: '2023-07-02',
              imagem: 'nova-imagem.jpg',
              gostos: 20,
              user: 'novo-usuário',
            };
        
            const response = await request(app)
              .put(`/Ecopointer/events/event/${eventoId}`)
              .send(updatedEvento);
        
            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.msg).toBe('ID parameter is not a valid ObjectId');
          });
        });
        describe("Apagar eventp", () => {
            test('Deve deletar o evento com o ID fornecido', async () => {
               
            
                const response = await request(app).delete(`/Ecopointer/events/event/${newEvent._id}`)
                .set("Authorization", `Bearer ${accessToken}`);

            
                expect(response.status).toBe(200);
                expect(response.body.success).toBe(true);
                expect(response.body.msg).toBe(`Evento with ID ${newEvent._id} deleted successfully`);
            
                
              });
              test('Deve retornar erro 404 se o evento não for encontrado para exclusão', async () => {
               
            
                const response = await request(app).delete(`/Ecopointer/events/event/648b3cf4be1d7dd8efead2e0`)
                .set("Authorization", `Bearer ${accessToken}`);
            
                expect(response.status).toBe(404);
                expect(response.body.success).toBe(false);
                expect(response.body.msg).toBe(`Cannot delete evento with ID 648b3cf4be1d7dd8efead2e0`);
              });
              test('Deve retornar erro 403 se a solicitação não tiver função de administrador', async () => {
                const response1 = await request(app).post("/Ecopointer/users/login").send({
                    username: "Carlos",
                    password: "teste",
                  });
              
                  expect(response1.status).toBe(200);
              
                  // Acessar o token de acesso (accessToken)
                  accessToken = response1.body.accessToken;
              
            
                const response = await request(app).delete(`/Ecopointer/events/event/648b3cf4be1d7dd8efead2e0`)
                .set("Authorization", `Bearer ${accessToken}`);
            
            
                expect(response.status).toBe(403);
                expect(response.body.success).toBe(false);
                expect(response.body.msg).toBe('This request requires ADMIN role!');
              });
            });