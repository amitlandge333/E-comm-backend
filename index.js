const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./db/db");
const User = require("./model/userSchema");
const Product = require("./model/productSchema");
const Jwt = require("jsonwebtoken");
const auth = require("./middleware/auth");
connectDB.connect();
app.use(express.json());
app.use(cors());
app.get("/", (req, res) => {
  res.send("Welcome to Home Page");
});
app.post("/signup", async (req, res) => {
  // res.send(req.body);
  const user = await User(req.body);
  user.save();
  if (user) {
    const generateToken = Jwt.sign({ user }, "shhh", { expiresIn: "7h" });
    res.json({
      success: true,
      user,
      token: generateToken,
    });
  }
});
app.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.password) == password) {
    const generateToken = Jwt.sign({ user }, "shhh", { expiresIn: "2h" });
    res.json({
      success: true,
      user,
      token: generateToken,
    });
  } else {
    res.json({
      success: false,
    });
  }
});
app.post("/add-product", async (req, res) => {
  const product = await Product(req.body);
  const resp = await product.save();
  res.json(resp);
});
app.get("/products/:userId", auth,async (req, res) => {
  const id = req.params.userId;
  const products = await Product.find({ userId: id });
  res.json({
    products,
  });
});
app.delete("/delete/:productId", async (req, res) => {
  const id = req.params.productId;
  const deleteProduct = await Product.findByIdAndDelete(id);
  res.json({
    deleteProduct,
  });
});
app.get("/getProduct/:productId", async (req, res) => {
  const id = req.params.productId;
  const update_product = await Product.findById(id);
  res.json({
    update_product,
  });
});
app.put("/update-product/:productId", async (req, res) => {
  const id = req.params.productId;
  const update = await Product.updateOne(
    { _id: id },
    {
      $set: req.body,
    }
  );
  // update.save()
  res.json({
    update,
  });
});
app.get("/search/:key/:userId", async (req, res) => {
  const response = await Product.find({
    userId: req.params.userId,
    $or: [
      { name: { $regex: req.params.key } },
      { description: { $regex: req.params.key } },
      { category: { $regex: req.params.key } },
    ],
  });
  res.send(response);
});

app.listen(2000);
