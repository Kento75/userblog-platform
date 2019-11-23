const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

//// routers
const blogRoutes = require("./routes/blog.js");
const authRoutes = require("./routes/auth.js");
const userRoutes = require("./routes/user.js");
const categoryRoutes = require("./routes/category.js");

//// app
const app = express();

//// db
const db_url = process.env.DATABASE_LOCAL || process.env.DATABASE_CLOUD;
mongoose.connect(db_url, {
  useNewUrlParser: true,
  useCreateIndex: true, // インデックスを作成の許可
  useFindAndModify: false // FindAndModifyの無効化
}).then(() => console.log("DB connected!!"));


//// middlewares
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());
// cors
if (process.env.NODE_ENV == "development") {
  app.use(
    cors({
      origin: `${process.env.CLIENT_URL}`
    })
  );
}

//// routes middleware
app.use("/api", blogRoutes);
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);

//// port
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});