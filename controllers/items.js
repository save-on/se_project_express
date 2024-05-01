const ClothingItem = require("../models/clothingItem");
const {
  success,
  created,
  badRequest,
  notFound,
  internalError,
} = require("../utils/errors");

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(success).send(items))
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
  ClothingItem.findByIdAndRemove(itemId)
    .then((item) => {
      console.log(item);
      if (!item) {
        return res.status(notFound.code).send(notFound.text);
      }
      if (!item.owner.equals(req.user._id)) {
        return res.status(403).send({ message: "Forbidden" });
      }
      return res.status(success).send(item);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res.status(badRequest.code).send(badRequest.text);
      }
      return res.status(internalError.code).send(internalError.text);
    });
};

module.exports = { getItems, createItem, deleteItem };
