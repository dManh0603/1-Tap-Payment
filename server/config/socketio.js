const { Server } = require('socket.io');

module.exports = function initSocketIO(server) {
  const io = new Server(server, {
    pingTimeout: 60000,
  });

  io.on("connection", (socket) => {

    socket.on('setup', (userData) => {
      if (userData) {
        socket.join(userData._id);
        socket.emit(`connected`)
        console.log("user connected to: ", userData._id)
      }
    })

    socket.on('join chat', (room) => {
      socket.join(room)
      console.log('user joined room: ', room);
    });

    socket.on('typing', (room) => socket.in(room).emit('typing'));
    socket.on('stop typing', (room) => socket.in(room).emit('stop typing'));

    socket.on('new message', (newMessage) => {
      let chat = newMessage.chat;

      if (!chat.users) return console.log('chat.users not defined');

      chat.users.forEach(user => {

        if (user._id == newMessage.sender._id) return;

        socket.in(user._id).emit('message received', newMessage)
        console.log('send message to socket:', user._id)
      });
    })
  });
};
