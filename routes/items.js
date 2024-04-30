const router = require("express").Router();
const { getItems, createItem, deleteItem } = require("../controllers/items");
const auth = require("../middlewares/auth");

router.get("/", getItems);
router.post("/", auth, createItem);
router.delete("/:itemId", auth, deleteItem);

module.exports = router;
