import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.redirect("/login");
});

router.get("/about", (req, res) => {
  res.render("pages/about");
});

router.get("/contact", (req, res) => {
  res.render("pages/contact");
});

export default router;