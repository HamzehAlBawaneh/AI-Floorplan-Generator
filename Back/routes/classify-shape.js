const express = require("express");
const multer = require("multer");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
const router = express.Router();

const upload = multer({
  dest: "uploads/temp/",
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only image files are allowed!"));
  },
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.post("/classify-shape", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No file uploaded",
    });
  }

  const filePath = req.file.path;
  const pythonScript = path.join(__dirname, "../ml/classify_shape.py");

  try {
    const python = spawn("python", [pythonScript, filePath]);

    let dataString = "";
    let errorString = "";

    python.stdout.on("data", (data) => {
      dataString += data.toString();
    });

    python.stderr.on("data", (data) => {
      errorString += data.toString();
    });

    python.on("close", (code) => {
      fs.unlink(filePath, (err) => {
        if (err) console.error("Error deleting temp file:", err);
      });

      if (code !== 0) {
        console.error("Python Error:", errorString);
        return res.status(500).json({
          success: false,
          message: "Error processing image",
          error: errorString,
        });
      }

      try {
        const result = JSON.parse(dataString);
        res.json({
          success: true,
          data: result,
        });
      } catch (parseError) {
        res.status(500).json({
          success: false,
          message: "Error parsing result",
          error: parseError.message,
        });
      }
    });
  } catch (error) {
    fs.unlink(filePath, () => {});
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

module.exports = router;
