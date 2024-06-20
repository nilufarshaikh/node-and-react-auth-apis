import express from "express";
import bcrypt from "bcrypt";
const router = express.Router();
import { User } from "../models/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.findOne({ email: email });

    if (user !== null) {
      return res.json({ error: "User already exists" });
    }

    const hashpassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashpassword,
    });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.json({ message: "User is not registered" });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.json({ message: "Password is incorrect" });
    }

    const token = jwt.sign({ username: user.username }, process.env.KEY, {
      expiresIn: "1h",
    });
    res.cookie("token", token, { httpOnly: true, maxAge: 360000 });

    res.status(200).json({ status: true, message: "Logged in successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.json({ message: "User is not registered" });
    }

    const token = jwt.sign(
      { username: user.username, id: user.id },
      process.env.KEY,
      {
        expiresIn: "1h",
      }
    );

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "<add-your-email-id>",
        pass: "<add-your-google-app-password>",
      },
    });

    var mailOptions = {
      from: "<add-your-email-id>",
      to: email,
      subject: "Reset Password",
      text: `http://localhost:5173/resetPassword/${token}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        throw new Error();
      } else {
        console.log("Email sent: " + info.response);
        res.status(200).json({ status: true, message: "Email sent" });
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const decodedToken = jwt.verify(token, process.env.KEY);
    const id = decodedToken.id;

    const hashpassword = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate({ _id: id }, { password: hashpassword });

    res
      .status(200)
      .json({ status: true, message: "Password reset successful" });
  } catch (err) {
    console.log(err);
    return res.status(401).json({ message: "Invalid token" });
  }
});

const verifyUser = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(403).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.KEY);
    next();
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

router.get("/verify", verifyUser, (req, res) => {
  return res.status(200).json({ message: "Authorised" });
});

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({ message: "Logged out" });
});

export { router as UserRouter };
