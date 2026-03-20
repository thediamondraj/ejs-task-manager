import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const showRegister = (req, res) => {
  res.render("pages/register");
};

export const showLogin = (req, res) => {
  res.render("pages/login");
};

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.render("pages/register", { error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.redirect("/login");
  } catch (error) {
    res.render("pages/register", { error: "Registration failed" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.render("pages/login", { error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.render("pages/login", { error: "Invalid email or password" });
    }

    const accessToken = jwt.sign(
      { id: user._id },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.redirect("/dashboard");
  } catch (error) {
    res.render("pages/login", { error: "Login failed" });
  }
};

export const logout = async (req, res) => {
  try {
    if (req.user?.id) {
      const user = await User.findById(req.user.id);
      if (user) {
        user.refreshToken = null;
        await user.save();
      }
    }
  } catch (error) {
  }

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.redirect("/login");
};