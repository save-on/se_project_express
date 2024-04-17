const express = require('express');
const mongoose = require('mongoose')
const mainRouter = require("./routes/index")
const app = express();
const { PORT = 3001 } = process.env;

mongoose
.connect('mongodb://127.0.0.1:27017/wtwr_db')
.then(() => {
  console.log("connected to the database");
})
.catch(console.error)

app.use(express.json());

// temporary user auth
app.use((req, res, next) => {
  req.user = {
    _id: "661d41761c7d33166945f9a5"
  };
  next();
});

app.use("/", mainRouter)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})

