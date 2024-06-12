const router = require("express").Router();
const { getCurrentUser, updateCurrentUser } = require("../controllers/users");
const auth = require("../middlewares/auth");
const { validateUserUpdate } = require("../middlewares/validation");

router.get("/me", auth, getCurrentUser);
router.patch("/me", validateUserUpdate, auth, updateCurrentUser);

module.exports = router;
