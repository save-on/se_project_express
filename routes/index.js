const router = require("express").Router();
const itemRouter = require("./items");
const likeRouter = require("./likes");
const userRouter = require("./users");
const { notFound } = require("../utils/errors");
const { createUser, login } = require("../controllers/users");

router.post("/signin", login);
router.post("/signup", createUser);
router.use("/items", itemRouter);
router.use("/items", likeRouter);
router.use("/users", userRouter);

// Defensive code
router.use((req, res) => res.status(notFound.code).send(notFound.text));

module.exports = router;
