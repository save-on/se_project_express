const ClothingItem = require("../models/clothingItem");
const { created } = require("../utils/errors");
const BadRequestError = require("../utils/errorclasses/BadRequestError");
const NotFoundError = require("../utils/errorclasses/NotFoundError");

const likeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(created).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("The Requested resource was not found."));
      }
      if (err.name === "CastError") {
        next(
          new BadRequestError(
            "The request could not be processed due to invalid input data."
          )
        );
      }
      next(err);
    });
};

const dislikeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("The Requested resource was not found."));
      }
      if (err.name === "CastError") {
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
  likeItem,
  dislikeItem,
};
