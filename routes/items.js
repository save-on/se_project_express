const router = require("express").Router();
const { getItems, createItem, deleteItem } = require("../controllers/items");
const auth = require("../middlewares/auth");
const {
  validateCardBody,
  validateItemId,
} = require("../middlewares/validation");

router.get("/", getItems);
router.post("/", validateCardBody, auth, createItem);
router.delete("/:itemId", validateItemId, auth, deleteItem);

module.exports = router;
