const express = require("express");
const multer = require("multer");
const path = require("path");
const app = express();

// Cấu hình multer để lưu ảnh vào thư mục 'uploads'
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // Đặt tên file ảnh theo tên gốc + thời gian hiện tại để tránh trùng lặp
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Cấu hình để chỉ chấp nhận file ảnh
const upload = multer({
  storage: storage,
  limits: { fileSize: 3000000 }, // Giới hạn kích thước file (1MB)
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb("Error: Chỉ chấp nhận file hình ảnh!");
    }
  },
});

// Tạo endpoint để nhận file upload
app.post("/uploads", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Không có file được chọn" });
  }

  // Trả về đường dẫn ảnh đã lưu
  res.json({
    message: "Upload thành công",
    file: `uploads/${req.file.filename}`, // Trả về đường dẫn để frontend có thể truy cập
  });
});
// Cấu hình để server có thể truy cập các file trong thư mục uploads
app.use("/uploads", express.static("uploads"));
// Khởi chạy server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
