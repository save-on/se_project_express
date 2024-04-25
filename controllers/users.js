const User = require("../models/user");
const {
  success,
  created,
  badRequest,
  notFound,
  internalError,
  unauthorized,
} = require("../utils/errors");
const { jwtToken } = require("../utils/config");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(success).send(users))
    .catch((err) => {
      console.error(err);
      return res.status(internalError.code).send(internalError.text);
    });
};

const getUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => res.status(success).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(notFound.code).send(notFound.text);
      }
      if (err.name === "CastError") {
        return res.status(badRequest.code).send(badRequest.text);
      }
      return res.status(internalError.code).send(internalError.text);
    });
};

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  const hash = bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        name,
        avatar,
        email,
        password: hash,
      })
    )
    .then((user) => res.status(created).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(badRequest.code).send(badRequest.text);
      }
      if (err.name === "MongoServerError") {
        return res.status(unauthorized.code).send(unauthorized.text);
      }
      return res.status(internalError.code).send(internalError.text);
    });
};

const login = (req, res) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, jwtToken, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      res
        .status(unauthorized.code)
        .send({ message: "Incorrect email or password" }); // come back to fix
    });
};

module.exports = { getUsers, getUser, createUser, login };
