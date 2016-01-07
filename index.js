var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// The initial code for this app comes from the chat example at
// http://socket.io/get-started/chat/

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.use(express.static('public'));

io.on('connection', function(socket){
  socket.on('touch', function(msg){
    //send to all clients
    //io.emit('chat message', msg);
    console.log(msg); // msg is the arg sent by the client
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
