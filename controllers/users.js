const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {
  success,
  created,
  badRequest,
  notFound,
  internalError,
  conflict,
} = require("../utils/errors");
const { jwtToken } = require("../utils/config");

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
  bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        email,
        name,
        avatar,
        password: hash,
      })
    )
    .then(() =>
      res.status(created).send({
        email,
        name,
        avatar,
      })
    )
    .catch((err) => {
      console.error(err);
      if (err.name === "MongoServerError") {
        return res.status(conflict.code).send(conflict.text);
      }
      if (err.name === "ValidationError") {
        return res.status(badRequest.code).send(badRequest.text);
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
      return res.status(success).send({ token });
    })
    .catch((err) => {
      console.error(err);
      return res.status(badRequest.code).send({ message: err.message });
    });
};

const getCurrentUser = (req, res) => {
  const { _id } = req.user;
  User.findById({ _id })
    .then((user) => res.status(success).send(user))
    .catch((err) => {
      console.error(err);
      return res.status(internalError.code).send(internalError.text);
    });
};

const updateCurrentUser = (req, res) => {
  const { _id } = req.user;
  User.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true })
    .then((user) => res.status(success).send(user))
    .catch((err) => {
      console.error(err);
      return res.status(internalError.code).send(internalError.text);
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  login,
  getCurrentUser,
  updateCurrentUser,
};
