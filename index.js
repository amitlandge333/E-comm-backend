require("dotenv").config();
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
const bcrypt = require("bcrypt");

app.get("/", (req, res) => {
  res.send("Welcome to Home Page");
});
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!(name && email && password)) {
      res.send("Please Enter Valid Information");
    }
    const user = await User.findOne({ email });
    if (user) {
      res.send("email is already used");
    }
    const bcryptPass = await bcrypt.hash(password, 10);
    const user_data = await User.create({
      name,
      email,
      password: bcryptPass,
    });
    const generateToken = Jwt.sign({ user_data }, process.env.SECRETE_KEY, {
      expiresIn: "2hr",
    });
    user_data.password = undefined;
    user_data.token = generateToken;
    res.json({
      success: true,
      user_data,
    });
  } catch (error) {
    res.json({
      success: false,
      message: "invalid information",
    });
  }
 
});
app.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email && !password) {
      res.json("Enter Valid info");
    }
    let user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const generateToken = Jwt.sign({ user }, process.env.SECRETE_KEY, {
        expiresIn: "2hr",
      });
      user.token = generateToken;
      user.password = undefined;
      res.json({
        success: true,
        user,
      });
    } else {
      res.json({
        success: false,
        message: "invalid user",
      });
    }
  } catch (error) {
    res.json({
      success: false,
      message: error,
    });
  }
});
app.post("/add-product", async (req, res) => {
  try {
    const { name, description, category, price, userId } = req.body;
    if (!(name && description && category && price && userId)) {
      throw new Error("Fill all information");
    }
    const product = await Product.create({
      name,
      description,
      category,
      price,
      userId,
    });
    await product.save();
    if (product) {
      res.json({
        success: true,
        product,
      });
    }
  } catch (error) {
    res.send(error);
  }
});
app.get("/products/:userId", auth, async (req, res) => {
  try {
    const id = req.params.userId;
    const products = await Product.find({ userId: id });
    if (!products) {
      throw new Error({
        success: false,
        message: "no products found",
      });
    }
    res.json({
      products,
    });
  } catch (error) {
    res.send(error);
  }
});
app.delete("/delete/:productId", async (req, res) => {
  try {
    const id = req.params.productId;
    const deleteProduct = await Product.findByIdAndDelete(id);
    if (!deleteProduct) {
      throw new Error("not deleted");
    }
    res.json({
      deleteProduct,
    });
  } catch (error) {
    res.send(error);
  }
});
app.get("/getProduct/:productId", async (req, res) => {
  try {
    const id = req.params.productId;
    const update_product = await Product.findById(id);
    if (!update_product) {
      throw new Error("Product not updated");
    }
    res.json({
      update_product,
    });
  } catch (error) {
    res.send(error);
  }
});
app.put("/update-product/:productId", async (req, res) => {
  try {
    const { name, description, category, price } = req.body;
    if (!(name && description && category && price)) {
      throw new Error("Please Fill all Information");
    }
    const id = req.params.productId;
    const update = await Product.updateOne(
      { _id: id },
      {
        $set: req.body,
      }
    );

    res.json({
      success: true,
      update,
    });
  } catch (error) {
    res.send(error);
  }
});
app.get("/search/:key/:userId", async (req, res) => {
  try {
    const response = await Product.find({
      userId: req.params.userId,
      $or: [
        { name: { $regex: req.params.key } },
        { description: { $regex: req.params.key } },
        { category: { $regex: req.params.key } },
      ],
    });
    if (!response) {
      throw new Error("failed response");
    }
    res.json(response);
  } catch (error) {
    res.send(error);
  }
});

app.listen(2000);
