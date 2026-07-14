// ===============================================
// server.js — ArchiMind Backend (Python Integration)
// ===============================================

import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });

import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";
import initDB from "./config/db.js";
import { upload, validateRequest } from "./app.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

async function startServer() {
  const { sequelize, Project } = await initDB();

  const uploadsDir = path.join(__dirname, "uploads");
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

  // ===============================================
  //  Main Route — Generate Floorplans
  // ===============================================
  // ===============================================
  //  Main Route — Generate Floorplans
  // ===============================================
  app.post(
    "/api/v1/generate-plans",
    upload.single("file"),
    validateRequest,
    async (req, res) => {
      try {
        const { projectType, budget, floors, area, areaUnit } = req.body;
        const uploadedFile = req.file;

        console.log("📦 Received Project Config:", {
          projectType,
          budget,
          floors,
          area,
          areaUnit,
        });

        // ---------------------------------------------
        // 1️⃣ Store in Database
        // ---------------------------------------------
        const newProject = await Project.create({
          projectType,
          budget,
          floors,
          area,
          areaUnit,
          imagePath: uploadedFile.path,
        });

        // ---------------------------------------------
        // 2️⃣ Run Shape Classifier (Python)
        // ---------------------------------------------
        console.log("🔍 Running Shape Classifier...");
        const classifierProcess = spawn("python", [
          path.join(__dirname, "backendConnectModel.py"),
          uploadedFile.path,
        ]);

        let shapeResult = "";
        let classifierError = "";
        let classifierOutput = "";
        classifierProcess.stdout.on("data", (data) => {
          const output = data.toString().trim();
          classifierOutput += output;
          // Only take the last line as the shape result (clean output)
          const lines = output.split("\n").filter((line) => line.trim());
          if (lines.length > 0) {
            shapeResult = lines[lines.length - 1].trim();
            console.log(`✅ Detected Land Shape: ${shapeResult}`);
          }
        });

        classifierProcess.stderr.on("data", (data) => {
          const errorMsg = data.toString();
          // Model loading messages go to stderr now, so just log them as info
          if (
            errorMsg.includes("Loaded model") ||
            errorMsg.includes("Total models loaded")
          ) {
            console.log(`🔍 ${errorMsg.trim()}`);
          } else {
            console.error(`❌ Shape Prediction Error: ${errorMsg}`);
            classifierError += errorMsg;
          }
        });

        // Wait for the classifier to finish with timeout
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            if (!shapeResult) {
              reject(new Error("Shape classifier timeout - no response received after 30 seconds"));
            }
          }, 30000);

          classifierProcess.on("close", (code) => {
            clearTimeout(timeout);
            console.log(`Classifier process exited with code: ${code}`);

            if (code === 0) {
              if (shapeResult) {
                resolve(shapeResult);
              } else {
                reject(new Error("No shape detected in the classifier output"));
              }
            } else {
              reject(
                new Error(
                  classifierError ||
                    `Shape classifier failed with exit code ${code}. ${classifierError || 'No error details available'}`
                )
              );
            }
          });

          classifierProcess.on("error", (err) => {
            clearTimeout(timeout);
            console.error("Failed to start shape classifier:", err);
            reject(new Error(`Shape classifier process error: ${err.message}`));
          });
        });

        // ---------------------------------------------
        // 3️⃣ Map Project Type to Python-Compatible Name
        // ---------------------------------------------
        const buildingTypeMap = {
          university: "SCHOOL",
          commercial: "COMPANY",
          company: "COMPANY",
          house: "HOUSE",
          hospital: "HOSPITAL",
          school: "SCHOOL",
        };

        const pythonProjectType =
          buildingTypeMap[newProject.projectType.toLowerCase()] ||
          newProject.projectType.toUpperCase();

        // ---------------------------------------------
        // 4️⃣ Run Floorplan Generator (Python)
        // ---------------------------------------------
        const pythonScriptPath = path.join(__dirname, "floorplan_final.py");

        // Fixed argument format for argparse
        const pythonArgs = [
          pythonScriptPath,
          `--projectType=${pythonProjectType}`,
          `--budget=${parseFloat(newProject.budget)}`,
          `--floors=${parseInt(newProject.floors)}`,
          `--area=${parseFloat(newProject.area)}`,
          `--areaUnit=${newProject.areaUnit}`,
          `--imagePath=${newProject.imagePath}`,
          `--shape=${shapeResult}`,
        ];

        console.log("🏗️ Building Type:", pythonProjectType);
        console.log("🚀 Starting Python script with args:", pythonArgs);

        let pythonOutput = "";
        let pythonError = "";

        const pythonProcess = spawn("python", pythonArgs, {
          stdio: ["pipe", "pipe", "pipe"],
          cwd: __dirname,
        });

        pythonProcess.stdout.on("data", (data) => {
          const output = data.toString();
          pythonOutput += output;
          console.log(`🐍 Python Output: ${output}`);
        });

        pythonProcess.stderr.on("data", (data) => {
          const error = data.toString();
          pythonError += error;
          console.error(`🐍 Python Error: ${error}`);
        });

        // FIX: Improved promise handling for floorplan process
        await new Promise((resolve, reject) => {
          pythonProcess.on("close", (code) => {
            console.log(`Floorplan process exited with code: ${code}`);
            if (code === 0) {
              console.log("✅ Python script completed successfully");
              resolve(code);
            } else {
              reject(
                new Error(
                  `Floorplan generator failed with exit code ${code}. Error: ${pythonError}`
                )
              );
            }
          });

          pythonProcess.on("error", (err) => {
            console.error("Failed to start floorplan generator.", err);
            reject(
              new Error(`Floorplan generator process error: ${err.message}`)
            );
          });

          // Add timeout to prevent hanging (5 minutes)
          const timeout = setTimeout(() => {
            pythonProcess.kill(); // Ensure the process is terminated
            reject(
              new Error("Floorplan generation timed out after 5 minutes. The process took too long to complete.")
            );
          }, 300000); // 5 minute timeout (300,000ms)

          // Clear the timeout if the process completes in time
          pythonProcess.on('close', () => {
            clearTimeout(timeout);
          });
        });

        // ---------------------------------------------
        // 5️⃣ Send Response to Frontend
        // ---------------------------------------------
        res.status(200).json({
          success: true,
          message: "Architectural plans generated successfully.",
          project: newProject,
          detectedShape: shapeResult,
          pythonOutput: pythonOutput,
        });
      } catch (err) {
        console.error("❌ Error generating plan:", err);
        res.status(500).json({
          success: false,
          message: err.message || "Internal Server Error",
        });
      }
    }
  );

  // ===============================================
  //  Fetch All Projects
  // ===============================================
  app.get("/api/v1/generate-plans", async (req, res) => {
    try {
      const projects = await Project.findAll({
        order: [["createdAt", "DESC"]],
      });
      res.status(200).json({
        success: true,
        projects,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  });

  // ===============================================
  //  Global Error Handler
  // ===============================================
  app.use((err, req, res, next) => {
    console.error("❌ Middleware Error:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Unexpected error occurred",
    });
  });

  // ===============================================
  //  Start Server
  // ===============================================
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
}

startServer();
