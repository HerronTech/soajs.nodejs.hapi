'use strict';

const Hapi = require('hapi');
const soajsMW = require('soajs.nodejs')({});

const server = new Hapi.Server();
server.connection({
    host: 'localhost',
    port: 4380
});
server.ext({
    type: 'onRequest',
    method: function (request, reply) {
        soajsMW(request, reply, function (err){
            if (err) {
                throw err;
            }
            return reply.continue();
        });
    }
});
server.route({
    method: 'GET',
    path: '/hello',
    handler: function (request, reply) {
        console.log(request.soajs)
        return reply('hello world hapi');
    }
});
server.start((err) => {

    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});
