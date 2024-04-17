const router = require("express").Router();
const userRouter = require("./users");
const itemRouter = require("./items");
const likeRouter = require("./likes");
const { notFound } = require("../utils/errors");

router.use("/users", userRouter);
router.use("/items", itemRouter);
router.use("/items", likeRouter);

// Defensive code
router.use((req, res) => {
  return res.status(notFound.code).send(notFound.text)
})

module.exports = router;