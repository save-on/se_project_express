const router = require("express").Router();
const itemRouter = require("./items");
const likeRouter = require("./likes");
const { notFound } = require("../utils/errors");
const { createUser, login } = require("../controllers/users");
const auth = require("../middlewares/auth");

router.post("/signin", auth, login);
router.post("/signup", createUser);
router.use("/items", itemRouter);
router.use("/items", likeRouter);
//

// Defensive code
router.use((req, res) => res.status(notFound.code).send(notFound.text));

module.exports = router;
