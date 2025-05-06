const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
const path = require('path');

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

let users = {};

io.on('connection', socket => {
  console.log('User connected:', socket.id);

  socket.on('register-user', data => {
    users[socket.id] = { ...data, socketId: socket.id };
    io.to('admin').emit('user-location', { ...data, id: socket.id });
  });

  socket.on('send-location', ({ latitude, longitude }) => {
    if (users[socket.id]) {
      users[socket.id].latitude = latitude;
      users[socket.id].longitude = longitude;
      io.to('admin').emit('user-location', { ...users[socket.id] });
    }
  });

  socket.on('join-admin', () => {
    socket.join('admin');
    // send existing users
    Object.values(users).forEach(user => {
      io.to(socket.id).emit('user-location', user);
    });
  });

  socket.on('disconnect', () => {
    if (users[socket.id]) {
      io.to('admin').emit('user-disconnected', socket.id);
      delete users[socket.id];
    }
  });
});

app.get('/admin', (req, res) => {
  res.render('admin');
});

app.get('/', (req, res) => {
  res.render('user');
});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
