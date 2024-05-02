const ClothingItem = require("../models/clothingItem");
const {
  created,
  badRequest,
  internalError,
  forbidden,
  notFound,
} = require("../utils/errors");

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch((err) => {
      console.error(err);
      return res.status(internalError.code).send(internalError.text);
    });
};

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => res.status(created).send({ data: item }))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(badRequest.code).send(badRequest.text);
      }
      return res.status(internalError.code).send(internalError.text);
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (String(item.owner) !== req.user._id) {
        return res.status(forbidden.code).send(forbidden.text);
      }
      return item
        .deleteOne()
        .then(() => res.send({ message: "Item deleted successfully" }));
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res.status(badRequest.code).send(badRequest.text);
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(notFound.code).send(notFound.text);
      }
      return res.status(internalError.code).send(internalError.text);
    });
};

module.exports = { getItems, createItem, deleteItem };
