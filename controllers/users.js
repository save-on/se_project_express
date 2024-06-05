const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {
  created,
  BadRequestError,
  UnauthorizedError,
  ConflictError,
} = require("../utils/errors");
const { jwtToken } = require("../utils/config");

const createUser = (req, res, next) => {
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
        next(
          new ConflictError("Email address already exists, please try again")
        );
      }
      if (err.name === "ValidationError") {
        next(
          new BadRequestError(
            "The request could not be processed due to invalid input data."
          )
        );
      }
      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError(
      "The request could not be processed due to invalid input data."
    );
  }
  return User.findUserByCredentials(email, password)
    .then(({ _id, name, avatar }) => {
      const token = jwt.sign({ _id }, jwtToken, {
        expiresIn: "7d",
      });
      return res.send({ token, name, avatar, _id });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "Incorrect email or password") {
        next(
          new UnauthorizedError(
            "Unauthorized, you must provide valid credentials to access this resource"
          )
        );
      }
      next(err);
    });
};

const getCurrentUser = (req, res, next) => {
  const { _id } = req.user;
  User.findById({ _id })
    .then((user) => res.send(user))
    .catch((err) => {
      console.error(err);
      next(err);
    });
};

const updateCurrentUser = (req, res, next) => {
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
        next(
          new BadRequestError(
            "The request could not be processed due to invalid input data."
          )
        );
      }
      next(err);
    });
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateCurrentUser,
};
