const User = require("../models/user");
const { success, created, badRequest, notFound, internalError } = require("../utils/errors");

const getUsers = (req, res) => {
  User.find({})
    .then(users => res.status(success).send(users))
    .catch((err) => {
      console.error(err);
      return res.status(internalError.code).send(internalError.text)
    });
}

const getUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail()
    .then(user => res.status(success).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(notFound.code).send(notFound.text)
      }
      if (err.name === "CastError") {
          return res.status(badRequest.code).send(badRequest.text)
      }
      return res.status(internalError.code).send(internalError.text)
    })
}

const createUser = (req, res) => {
  const { name, avatar } = req.body
  User.create({ name, avatar })
    .then(user => res.status(created).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(badRequest.code).send(badRequest.text)
      }
      return res.status(internalError.code).send(internalError.text)
    })
}

module.exports = { getUsers, getUser, createUser }