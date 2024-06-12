const router = require("express").Router();
const { getItems, createItem, deleteItem } = require("../controllers/items");
const auth = require("../middlewares/auth");
const {
  validateCardBody,
  validateItemId,
} = require("../middlewares/validation");

router.get("/", getItems);
router.post("/", auth, validateCardBody, createItem);
router.delete("/:itemId", auth, validateItemId, deleteItem);

module.exports = router;
