const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const userController = require("./controllers/userController");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use("/profile", express.static(path.join(__dirname, "uploads/profile")));
// Serve static files สำหรับ folder profile
app.use('/profile', express.static(path.join(__dirname, 'uploads/profile')));
app.post(
  "/updateProfile",
  userController.upload.single("profileImage"),
  userController.updateProfile
);

app.post("/register", userController.register);
app.post("/login", userController.login);

// ใช้ multer middleware จาก userController.upload
app.put("/update-profile", userController.upload.single("image"), userController.updateProfile);

app.get("/", (req, res) => res.send("🚀 Server is running"));

app.listen(PORT, () => console.log(`✅ Server started at http://localhost:${PORT}`));
