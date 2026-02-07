const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

//Routes
app.use("/auth", require("./routes/auth.routes"));
app.use("/blogs", require("./routes/blog.routes"));
app.use("/users", require("./routes/user.routes"));

module.exports = app;