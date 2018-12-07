'use strict';

const Hapi = require('hapi');
const soajsConf = require('./soajs.json');
const soajsMW = require('soajs.nodejs')(soajsConf);
let url = require('url');

const server = new Hapi.Server()

server.connection({
    host: '0.0.0.0',
    port: 4380
});

server.ext({
    type: 'onRequest',
    method: (request, reply) => {
        soajsMW(request, reply, (err) => {
            if (err) {
                throw err;
            }
            return reply.continue();
        });
    }
});


server.route({
    method: 'GET',
    path: '/heartbeat',
    handler: (request, reply) => {
        return reply({
            "status": 1
        });
    }
});

server.route({
    method: 'GET',
    path: '/tidbit/hello',
    handler: (request, reply) => {

        let url_parts = url.parse(request.url, true);
        let query = url_parts.query;

        let username = query.username;
        let lastname = query.lastname;

        return reply({
            "message": "Hello, I am a HAPI service, you are [" + username + "] and your last name is : [" + lastname + "]"
        });
    }
});

server.route({
    method: 'POST',
    path: '/tidbit/hello',
    handler: (request, reply) => {
        var response = request.soajs;
        request.soajs.awareness.getHost((host) => {
            response.controller = host;

            if (request.soajs.reg) { // if SOAJS_REGISTRY_API is set and everything went well, reg will be defined
                response.databases = request.soajs.reg.getDatabases();
            }

            return reply(response);
        });
    }
});

server.start((err) => {

    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});