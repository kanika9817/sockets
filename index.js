const express=require('express')
const app=express();
const http = require('http').Server(app);
const io = require('socket.io')(http);


app.use(express.static('public'));

app.get('/games', function(req, res) {
   res.sendFile(__dirname+'/public/index1.html');
  
});


//intialize array
users = [];
//games namespace
const chat = io.of('/games');
chat.on('connection',function(socket)
{
   socket.on('setUsername', function(data) {
      if(users.indexOf(data) > -1) {
         socket.emit('userExists', data + ' username is taken! Try some other username.');
      } 
      else {
         users.push(data);
         socket.emit('userSet', {username: data});
      }
   });

   
       socket.on('msg', function(data) {
       socket.emit('newmsg', data);//requested user only
       socket.broadcast.emit('chat', data);//every user

   })
})


io.on('connection',function(socket)
{
   socket.on('setUsername', function(data) {
      if(users.indexOf(data) > -1) {
         socket.emit('userExists', data + ' username is taken! Try some other username.');
      } 
      else {
         users.push(data);
         socket.emit('userSet', {username: data});
      }
   });
   
       socket.on('msg', function(data) {
       socket.emit('newmsg', data);//requested user only
      socket.broadcast.emit('chat', data);//every user

   })
})


http.listen(3000, function() {
   console.log('listening on localhost:3000');
});
