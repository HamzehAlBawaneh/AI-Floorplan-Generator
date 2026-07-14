import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) cb(null, true);
  else
    cb(new Error("Invalid file type. Only JPEG, JPG, and PNG allowed."), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

const validateRequest = (req, res, next) => {
  const { projectType, budget, floors, area, areaUnit } = req.body;
  const errors = [];

  if (!projectType) errors.push("Project type is required");
  if (!budget || isNaN(budget) || budget <= 0)
    errors.push("Valid budget is required");
  if (!floors || isNaN(floors) || floors < 1)
    errors.push("Valid number of floors is required");
  if (!area || isNaN(area) || area <= 0) errors.push("Valid area is required");
  if (!areaUnit || !["m2", "dunum"].includes(areaUnit))
    errors.push("Valid area unit is required");
  if (!req.file) errors.push("Image file is required");

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  next();
};

export { upload, validateRequest };
