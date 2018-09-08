var params = new URLSearchParams(window.location.search);

//Referencias de jquery
var divUsuarios = $('#divUsuarios');
var formEnviar = $('#formEnviar');
var txtMensaje = $('#txtMensaje');
var divChatbox = $('#divChatbox');

var nombre = params.get('nombre');
var sala = params.get('sala');


//Funcion para renderizar usuarios
function renderizarUsuarios(personas){

    console.log(personas);

    var html = '<li><a href="javascript:void(0)" class="active"> Chat de <span>'+sala+'</span></a></li>';

    for(var i=0;i<personas.length;i++){
        html += '<li><a data-id="'+personas[i].id+'" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>'+personas[i].nombre+'<small class="text-success">online</small></span></a></li>';
    }

    divUsuarios.html(html);
}

//Funcion para renderizar mensajes
function renderizarMensajes(mensaje){

    var fecha = new Date(mensaje.fecha);
    var hora = fecha.getHours() + ':' + fecha.getMinutes();
    var html = '';

    var adminClass = 'info';
    var adminImg = '<div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
    if(mensaje.usuario === 'Administrador'){
        adminImg = '';
        adminClass = 'danger';
    }

    if(mensaje.usuario === nombre){
        html += '<li class="reverse">';
        html += '    <div class="chat-content">';
        html += '        <h5>'+mensaje.usuario+'</h5>';
        html += '        <div class="box bg-light-inverse">'+mensaje.mensaje+'</div>';
        html += '    </div>';
        html += '    <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>';
        html += '    <div class="chat-time">'+hora+'</div>';
        html += '</li>';
    }else{
        html += '<li class="animated fadeIn">';
        html += adminImg;
        html += '   <div class="chat-content">';
        html += '       <h5>'+mensaje.usuario+'</h5>';
        html += '       <div class="box bg-light-'+adminClass+'">'+mensaje.mensaje+'</div>';
        html += '   </div>';
        html += '   <div class="chat-time">'+hora+'</div>';
        html += '</li>';
    }

    divChatbox.append(html);
    scrollBottom();

}

function scrollBottom() {

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}


//Listeners
divUsuarios.on('click', 'a', function(){

    var id = $(this).data('id');

    if(id){
        console.log(id);
    }
});

formEnviar.submit(function(e){

    e.preventDefault();

    if(txtMensaje.val().trim().length === 0){
        return;
    }

    socket.emit('crearMensaje', {
        nombre: nombre,
        mensaje: txtMensaje.val()
    }, function(res) {
        txtMensaje.val('').focus();
        renderizarMensajes(res);
    });

});
