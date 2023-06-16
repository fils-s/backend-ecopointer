const mongoose = require("mongoose");
const request = require("supertest");
const { app, server } = require("../mainindex");
const jwt = require("jsonwebtoken");
const config = require("../config/db.config");
const User = require("../models/user.model");
const { log } = require("console");
const db = require("../models");
const Post = db.posts;
let accessToken;
let createPost
let newPost;

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
  const post = new Post({
    imagem: 'imagem.jpg', data: '2023-06-15'
  });

   newPost = await post.save();






 

console.log(  newPost._id);
  console.log(newPost)

  
});



afterAll(async () => {
  await Post.findByIdAndRemove(newPost._id);
  await mongoose.disconnect();
  server.close();
});
describe('Criar um post', () => {
    test('Deve criar um novo post', async () => {
        const response1 = await request(app).post("/Ecopointer/users/login").send({
            username: "Carlos13",
            password: "teste",
          });
      
          expect(response1.status).toBe(200);
      
          // Acessar o token de acesso (accessToken)
          accessToken = response1.body.accessToken;
        const post = { imagem: 'imagem.jpg', data: '2023-06-15' };
    
        const response = await request(app)
          .post('/Ecopointer/posts/post')
          .set("Authorization", `Bearer ${accessToken}`)

          .send(post);
    
        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.msg).toBe('New Post created.');
        expect(response.body.URL).toMatch(/\/post\/[a-f0-9]+/);
    
        
      });
      test('Deve retornar erro 400 ao criar um post com dados inválidos', async () => {
        const invalidPost = { imagem: '', data: 'invalid' };
    
        const response = await request(app)
        .post('/Ecopointer/posts/post')
        .set("Authorization", `Bearer ${accessToken}`)
          .send(invalidPost);
    
        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.msg).toBe('Validation error');
        expect(response.body.errors).toBeDefined();
      });
      test("Deve retornar erro 401 se não fornecer token", async () => {
        const invalidPost = { imagem: '', data: 'invalid' };
    
        const response = await request(app)
        .post('/Ecopointer/posts/post')
        .set("Authorization", `Bearer ${accessToken}`)
          .send(invalidPost);
          expect(401);

          expect(response.body.success).toBe(false);
    
    
    });
});
describe('Buscar todos os posts', () => {
    test('Deve retornar todos os posts', async () => {
        const response = await request(app)
          .get('/Ecopointer/posts/post');
    
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
       
      });
    });
    describe('Buscar um post em escifico', () => {
        test('Deve retornar um post com o ID especificado', async () => {
            const response = await request(app)
              .get(`/Ecopointer/posts/post/${newPost._id}`);
        
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            
          });
          test('Deve retornar erro 404 se o post não for encontrado', async () => {
            // Gerar um ID inválido para simular um post inexistente
            const invalidPostId = 'invalidId123';
        
            const response = await request(app)
              .get(`/Ecopointer/posts/post/646e952b342c4f94765f9032`);
        
            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(response.body.msg).toBe(`Cannot find any Post with the ID 646e952b342c4f94765f9032`);
          });
          test('Deve retornar erro 400 se o ID não for válido', async () => {
            // Gerar um ID inválido para simular uma solicitação com um ID inválido
          
        
            const response = await request(app)
              .get(`/Ecopointer/posts/post/646e952b342c4f94765f9032}`);
        
            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.msg).toBe('ID parameter is not a valid ObjectId');
          });
        
        });
        describe('Update um post em escifico', () => {
            test('Deve atualizar o post com o ID especificado', async () => {
                const updatedData = {
                  imagem: 'imagem2.jpg',
                  data: '2023-06-16',
                  user: 'user2',
                  ecoponto: '648c3e8ffe9176242ff64455',
                };
            
                const response = await request(app)
                  .put(`/Ecopointer/posts/post/${newPost._id}`)
                  .send(updatedData);
            
                expect(response.status).toBe(200);
                expect(response.body.success).toBe(true);
                expect(response.body.msg).toBe(`Post with ID ${newPost._id} updated successfully`);
            
                
              });
              test('Deve retornar erro 404 se o post não for encontrado', async () => {
                
                const updatedData = {
                  imagem: 'imagem2.jpg',
                  data: '2023-06-16',
                  user: 'user2',
                  ecoponto: 'ecoponto2',
                };
            
                const response = await request(app)
                  .put(`/Ecopointer/posts/post/646e952b342c4f94765f9035`)
                  .send(updatedData);
            
                expect(response.status).toBe(404);
                expect(response.body.success).toBe(false);
                expect(response.body.msg).toBe(`Cannot update Post with ID 646e952b342c4f94765f9035`);
              });
              test('Deve retornar erro 400 se o ID não for válido', async () => {
                
                const updatedData = {
                  imagem: 'imagem2.jpg',
                  data: '2023-06-16',
                  user: 'user2',
                  ecoponto: '648c3e8ffe9176242ff64455',
                };
            
                const response = await request(app)
                  .put(`/Ecopointer/posts/post/646e952b342c4f94765f9035}`)
                  .send(updatedData);
            
                expect(response.status).toBe(400);
                expect(response.body.success).toBe(false);
                expect(response.body.msg).toBe('ID parameter is not a valid ObjectId');
              });
            });
            describe('Apagar um post em escifico', () => {
                test('Deve deletar o post com o ID especificado', async () => {
                    const response = await request(app).delete(`/Ecopointer/posts/post/${newPost._id}`)
                    .set("Authorization", `Bearer ${accessToken}`);
                    console.log(response.body.msg);
                
                    expect(response.status).toBe(200);
                    expect(response.body.success).toBe(true);
                    expect(response.body.msg).toBe(`Post with ID ${newPost._id} deleted successfully`);
                
                  
                  });
                  test('Deve retornar erro 404 se o post não for encontrado', async () => {
                    
                
                    const response = await request(app).delete(`/Ecopointer/posts/post/648a4bbae0ce6e9c1e4f8a59`)
                    .set("Authorization", `Bearer ${accessToken}`);
                
                    expect(response.status).toBe(404);
                    expect(response.body.success).toBe(false);
                    expect(response.body.msg).toBe(`Cannot delete Post with ID 648a4bbae0ce6e9c1e4f8a59`);
                  });
                  test('Deve retornar erro 403 se o usuário não tiver permissão de administrador', async () => {
                    const response1 = await request(app).post("/Ecopointer/users/login").send({
                        username: "Carlos",
                        password: "teste",
                      });
                  
                      expect(response1.status).toBe(200);
                  
                      // Acessar o token de acesso (accessToken)
                      accessToken = response1.body.accessToken;
                    
                    const response = await request(app)
                      .delete(`/Ecopointer/posts/post/648a4bbae0ce6e9c1e4f8a59`)
                      .set("Authorization", `Bearer ${accessToken}`);
                
                    expect(response.status).toBe(403);
                    expect(response.body.success).toBe(false);
                    expect(response.body.msg).toBe('This request requires ADMIN role!');
                  });
                  test('Deve retornar erro 401 se o usuário não estiver autenticado', async () => {
                    const response = await request(app).delete(`/Ecopointer/posts/post/648a4bbae0ce6e9c1e4f8a59`);
                
                    expect(response.status).toBe(401);
                    expect(response.body.success).toBe(false);
                    expect(response.body.msg).toBe('No token provided!');
                  });
                });
            

