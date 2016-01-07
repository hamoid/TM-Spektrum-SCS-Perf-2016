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
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
