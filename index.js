var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var vizSocket;
var timesyncServer = require('timesync/server');

// The initial code for this app comes from the chat example at
// http://socket.io/get-started/chat/

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.use('/timesync', timesyncServer.requestHandler);

app.use(express.static('public'));

io.on('connection', function(socket){
  socket.on('touch', function(msg){
    //io.emit('chat message', msg); // to all connected clients
    //we want to transmit the time to clients
    console.log(msg); // msg is the arg sent by the client
  });
  socket.on('i-am-viz', function(msg) {
    vizSocket = socket;
  });
  //socket.emit('bla', 22); // to one client
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
