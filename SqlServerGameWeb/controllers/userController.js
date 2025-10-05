const db = require("../config/database");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const uploadDir = path.join(__dirname, "../uploads/profile");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `profile_${Date.now()}${ext}`);
  }
});
const upload = multer({ storage });

exports.upload = upload;
// ✅ สมัครสมาชิก (Register)
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: "กรอกข้อมูลให้ครบ" });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `INSERT INTO User (name, email, password) VALUES (?, ?, ?)`;
    db.run(sql, [name, email, hashedPassword], function (err) {
      if (err) {
        console.error("❌ Register error:", err.message);
        return res.status(500).json({ message: "สมัครไม่สำเร็จ", error: err.message });
      }
      res.json({ message: "✅ สมัครสำเร็จ", userId: this.lastID });
    });
  } catch (error) {
    res.status(500).json({ message: "เกิดข้อผิดพลาด", error });
  }
};

// ✅ เข้าสู่ระบบ (Login)
exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "กรอกอีเมลและรหัสผ่าน" });

  const sql = `SELECT * FROM User WHERE email = ?`;
  db.get(sql, [email], async (err, user) => {
    if (err) {
      console.error("❌ Login error:", err.message);
      return res.status(500).json({ message: "เกิดข้อผิดพลาด", error: err.message });
    }

    if (!user)
      return res.status(404).json({ message: "ไม่พบบัญชีนี้" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ message: "รหัสผ่านไม่ถูกต้อง" });

    res.json({
      message: "✅ เข้าสู่ระบบสำเร็จ",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        type: user.type,
        image: user.image || null
      }
    });
  });
};


// Update profile
exports.updateProfile = (req, res) => {
  const { id, name, email } = req.body;
  let imagePath = null;

  if (!id || !name || !email) {
    return res.status(400).json({ message: "กรอกข้อมูลให้ครบ" });
  }

  // ✅ ถ้ามีไฟล์ถูกอัปโหลด (ผ่าน multer)
  if (req.file) {
    imagePath = `/profile/${req.file.filename}`;
  }

  // ✅ ถ้ามีรูปแบบ base64
  else if (req.body.profileImage && req.body.profileImage.startsWith("data:image/")) {
    const matches = req.body.profileImage.match(/^data:image\/(\w+);base64,(.+)$/);
    if (matches) {
      const ext = matches[1];
      const data = matches[2];
      const fileName = `profile_${id}_${Date.now()}.${ext}`;
      const dir = path.join(__dirname, "../uploads/profile");
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, fileName), Buffer.from(data, "base64"));
      imagePath = `/profile/${fileName}`;
    }
  }

  const sql = `UPDATE User SET name = ?, email = ?, image = ? WHERE id = ?`;
  db.run(sql, [name, email, imagePath, id], function (err) {
    if (err) {
      return res.status(500).json({ message: "Update failed", error: err.message });
    }

    db.get("SELECT id, name, email, type, image FROM User WHERE id = ?", [id], (err, user) => {
      if (err) return res.status(500).json({ message: "Cannot fetch user", error: err.message });
      res.json({ message: "Profile updated", user });
    });
  });
};