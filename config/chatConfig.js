const chatConfig = (socket) => {
  socket.on("join", (data) => {
    const { name, room } = data;
    const { user, error } = addUser({ id: socket.id, name, room });
    if (error) return;
    /*^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                      -emit messages on room join
    ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*/
    socket.emit("message", {
      user: "admin",
      text: `Welcome, ${user.name}`,
    });

    socket.broadcast.to(user.room).emit("message", {
      user: "admin",
      text: `${user.name} just joined the room!`,
    });
    socket.join(user.room);

    io.to(user.room).emit("room-data", {
      room: user.room,
      users: getAllUsers(user.room),
    });
  });

  socket.on("left", () => {
    const user = removeUser(socket.id);

    user &&
      io.to(user.room).emit("messsage", {
        user: "admin",
        text: `${user.name} left!`,
      });
  });
}


module.exports = chatConfig;