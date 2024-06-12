const ClothingItem = require("../models/clothingItem");
const { created } = require("../utils/errors");
const BadRequestError = require("../utils/errorclasses/BadRequestError");
const ForbiddenError = require("../utils/errorclasses/ForbiddenError");
const NotFoundError = require("../utils/errorclasses/NotFoundError");

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch((err) => {
      console.error(err);
      next(err);
    });
};

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => res.status(created).send({ data: item }))
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

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (String(item.owner) !== req.user._id) {
        throw new ForbiddenError(
          "Access Forbidden, you are not authorized to perform this action"
        );
      }
      return item
        .deleteOne()
        .then(() => res.send({ message: "Item deleted successfully" }));
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        next(
          new BadRequestError(
            "The request could not be processed due to invalid input data."
          )
        );
      }
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("The Requested resource was not found."));
      }
      next(err);
    });
};

module.exports = { getItems, createItem, deleteItem };
