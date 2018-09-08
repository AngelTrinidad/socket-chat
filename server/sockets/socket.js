const { io } = require('../server');
const {Usuarios} = require('../classes/usuarios');

const usuarios = new Usuarios();

io.on('connection', (client) => {

    client.on('entrarChat', (data, callback) => {

        if(!data.nombre || !data.sala) return callback({error: true, mensaje: 'El nombre/sala es necesario'});

        client.join(daa.sala);

        usuarios.agregarPersona(client.id, data.nombre, data.sala);

        let personasPorSalas = usuarios.getPersonasPorSalas(data.sala);

        client.broadcast.to(data.sala).emit('listaPersona', personasPorSalas);

        callback(personasPorSalas);
    });

    client.on('crearMensaje', (data) => {

        let persona = usuarios.getPersona(client.id);

        client.broadcast.to(persona.sala).emit('crearMensaje', {usuario: persona.nombre, mensaje: data.mensaje, fecha: new Date().getTime()});
    })

    client.on('disconnect', () => {
        let personaBorrada = usuarios.borrarPersona(client.id);

        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', {usuario: 'Administrador', mensaje: `${personaBorrada.nombre} abandonó el chat`, fecha: new Date().getTime()})
        client.broadcast.to(personaBorrada.sala).emit('listaPersona', usuarios.getPersonasPorSalas(personaBorrada.sala));
    });

    //Mensajes privados
    client.on('mensajePrivado', (data) => {

        let persona = usuarios.getPersona(client.id);

        client.broadcast.to(data.para).emit('mensajePrivado', {usuario: persona.nombre, mensaje: data.mensaje, fecha: new Date().getTime()});
    });

});
