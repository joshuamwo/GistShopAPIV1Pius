const conversation = require("../MODELS/chat/conversationSchema");

const addUser = (id) => {
  conversation
    .create(id)
    .then(
      (newUser) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(newUser);
      },
      (err) => {
        res.statusCode = 401;
        res.setHeader("Content-Type", "application/json");
        res.json(err.errors);
      }
    )
    .catch((err) => {
      res.statusCode = 401;
      res.setHeader("Content-Type", "application/json");
      res.json(err.errors);
    });
};

const removeUser = (id) => {
  conversation
    .findByIdAndDelete(id)
    .then(
      (object) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json("deleted succesfully");
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
};

module.exports = { addUser, removeUser };
