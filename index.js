var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var vizSocket;
var timesyncServer = require('timesync/server');

var players = {};
var startTime = 0;
var endTime = 0;

// The initial code for this app comes from 
// the chat example at
// http://socket.io/get-started/chat/

app.use('/timesync', timesyncServer.requestHandler);
app.use(express.static('public'));

io.on('connection', function(socket){
  var remoteIP = socket.request.connection.remoteAddress;

  players[socket.id] = { ip:remoteIP, syncCount: 0 };

  // Tell everyone about the new player
  io.emit('players', players);

  // Tell new player about the time span,
  // in case she joins late
  socket.emit('setTimeSpan', startTime, endTime);

  // A client has sync'ed time with the server
  socket.on('sync', function(count) {
    players[socket.id].syncCount = count;
    io.emit('players', players);
  });

  // Start the show
  socket.on('start', function() {
    if(startTime == 0) {
      var performanceDuration = 10; // minutes
      startTime = (new Date()).getTime();
      endTime = startTime + performanceDuration * 60 * 1000;
    }
    io.emit('setTimeSpan', startTime, endTime);
  });

  // User left. Tell everyone.
  socket.on('disconnect', function() {
    delete players[socket.id];
    io.emit('players', players);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
