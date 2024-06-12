const router = require("express").Router();
const { likeItem, dislikeItem } = require("../controllers/likes");
const auth = require("../middlewares/auth");
const { validateItemId } = require("../middlewares/validation");

router.put("/:itemId/likes", validateItemId, auth, likeItem);
router.delete("/:itemId/likes", validateItemId, auth, dislikeItem);

module.exports = router;
