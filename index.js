'use strict';

const Hapi = require('hapi');
const soajsMW = require('soajs.nodejs')({});
var url = require('url');

const server = new Hapi.Server();
server.connection({
    host: '0.0.0.0',
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
    path: '/tidbit/hello',
    handler: function (request, reply) {

	    var url_parts = url.parse(request.url, true);
	    var query = url_parts.query;

	    var username = query.username;
	    var lastname = query.lastname;

        return reply({
	        "message": "Hello, I am a HAPI service, you are ["+username+"] and your last name is : ["+lastname+"]"
        });
    }
});

server.route({
	method: 'POST',
	path: '/tidbit/hello',
	handler: function (request, reply) {
		var response = request.soajs;
		request.soajs.awareness.getHost(function(host){
			response.controller = host;
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
