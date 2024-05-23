const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {
  created,
  badRequest,
  unauthorized,
  internalError,
  conflict,
} = require("../utils/errors");
const { jwtToken } = require("../utils/config");

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
  if (!email || !password) {
    return res.status(badRequest.code).send(badRequest.text);
  }
  return User.findUserByCredentials(email, password)
    .then(({ _id, name, avatar }) => {
      const token = jwt.sign({ _id }, jwtToken, {
        expiresIn: "7d",
      });
      return res.send({ token, name, avatar });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "Incorrect email or password") {
        return res.status(unauthorized.code).send(unauthorized.text);
      }
      return res.status(internalError.code).send(internalError.text);
    });
};

const getCurrentUser = (req, res) => {
  const { _id } = req.user;
  User.findById({ _id })
    .then((user) => res.send(user))
    .catch((err) => {
      console.error(err);
      return res.status(internalError.code).send(internalError.text);
    });
};

const updateCurrentUser = (req, res) => {
  const { _id } = req.user;
  const { name, avatar } = req.body;
  User.findByIdAndUpdate(
    _id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((user) => res.send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(badRequest.code).send(badRequest.text);
      }
      return res.status(internalError.code).send(internalError.text);
    });
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateCurrentUser,
};
