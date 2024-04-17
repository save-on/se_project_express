const Item = require("../models/clothingItem");
const { success, created, badRequest, notFound, internalError } = require("../utils/errors");

const getItems = (req, res) => {
  Item.find({})
    .then(items => res.status(success).send(items))
    .catch((err) => {
      console.error(err);
      return res.status(internalError.code).send(internalError.text)
    })
};

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body
  Item.create({ name, weather, imageUrl, owner: req.user._id })
    .then(item => res.status(created).send({data:item}))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(badRequest.code).send(badRequest.text)
      }
      return res.status(internalError.code).send(internalError.text)
    })
};

const deleteItem = (req, res) => {
  Item.findByIdAndRemove(req.params.itemId)
    .orFail()
    .then((item) => res.status(success).send(item))
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
};

module.exports = { getItems, createItem, deleteItem };