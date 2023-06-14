const mongoose = require('mongoose');
const request = require('supertest');
const { app, server } = require('../mainindex');
const jwt = require('jsonwebtoken');
const config = require('../config/db.config');
const Desafio = require('../models/desafio.model');
let authToken
const desafioController = require('./desafios.controller');

//não funciona pq ;-;

const database = config.URL;
console.log(server);

beforeAll(async () => {
  await mongoose.connect(database, { useNewUrlParser: true });
});

afterAll(async () => {
  await mongoose.disconnect();
  server.close();
});

describe('Challenge controller', () => {
  test('Criar um desafio', async () => {
    const response = await request(app)
      .post('/challenges')
      .send({ xp:300,descDesafio:"Adiciona 5 novos ecopontos", recompensa:"", objetivoDesafio:5, estadoDesafio:0, username:"carlos"});

    expect(response.status).toBe(201);
    expect(response.body.desafio.xp).toBe(300);
    expect(response.body.desafio.estadoDesafio).toBe(0);
    expect(response.body.desafio.descDesafio).toBe('Adiciona 5 novos ecopontos');
  });

  test('Buscar todos os desafios', async () => {
    // Seed some test data
    await request(app).post('/challenges').send({ xp:200,descDesafio:"Adiciona 3 novos ecopontos", recompensa:"nada", objetivoDesafio:3, estadoDesafio:0, username:"leo"});
    await request(app).post('/challenges').send({ xp:500,descDesafio:"Cria 1 evento", recompensa:"nada", objetivoDesafio:1, estadoDesafio:0, username:"carlos"});

    const response = await request(app).findAll('/challenges');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('challenges');
    expect(response.body.desafio).toHaveLength(2);
    expect(response.body.desafio[0].xp).toBe(200);
    expect(response.body.desafio[1].xp).toBe(500);
  });

  test('Buscar um desafio pelo ID', async () => {
    // Seed some test data
    const desafioCriado = await request(app).post('/challenges').send({ xp:200,descDesafio:"Adiciona 3 novos ecopontos", recompensa:"", objetivoDesafio:3, estadoDesafio:0, username:"pedro"});

    const req = { params: { id: desafioCriado._id} };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await desafioController.findOne(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ desafio: expect.objectContaining({ xp:200,descDesafio:"Adiciona 3 novos ecopontos", recompensa:"", objetivoDesafio:3, estadoDesafio:0, username:"pedro"}) });
  });

  test('Editar um desafio', async () => {
    const desafioCriado =await request(app).post('/challenges').send({ xp:300,descDesafio:"Adiciona 5 novos ecopontos", recompensa:"", objetivoDesafio:5, estadoDesafio:0, username:"carlos"});

    const response = await request(app).update(req, res);

    const req = {
      params: { id: desafioCriado._id },
      body: { xp:500,descDesafio:"Adiciona 10 novos ecopontos", recompensa:"", objetivoDesafio:10, estadoDesafio:0, username:"carlos"},
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await desafioController.update(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: `Desafio with ID ${req.params.id} updated successfully` });

    const desafioAtualizado = await Desafio.findOne(desafioCriado._id);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('challenge');
    
    expect(desafioAtualizado.desafio.xp).toBe(500);
    expect(desafioAtualizado.objetivoDesafio).toBe(10);
    expect(desafioAtualizado.descDesafio).toBe('Adiciona 10 novos ecopontos');
  });

  test('Apagar um desafio', async () => {
    const desafioCriado =await request(app).post('/challenges').send({ xp:300,descDesafio:"Adiciona 5 novos ecopontos", recompensa:"", objetivoDesafio:5, estadoDesafio:0, username:"carlos"});

    const response = await request(app).update(req, res);

    const req = {
      params: { id: desafioCriado._id },
      body: { xp:500,descDesafio:"Adiciona 10 novos ecopontos", recompensa:"", objetivoDesafio:10, estadoDesafio:0, username:"carlos"},
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await desafioController.delete(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: `Desafio with ID ${req.params.id} deleted successfully` });
    
    const desafioApagado = await Desafio.findOne(desafioCriado._id);

    expect(desafioApagado).toBeNull()
  });

});
