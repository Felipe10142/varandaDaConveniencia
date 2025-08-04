import express from "express";
import { uploadSingle, uploadArray } from "../middleware/uploadMiddleware";
import { protect } from "../middleware/authMiddleware";
const router = express.Router();
router.post("/image", protect, uploadSingle("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Please upload a file" });
        }
        return res.status(200).json({
            success: true,
            data: req.file.path,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});
router.post("/images", protect, uploadArray("images", 5), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "Please upload files" });
        }
        const files = Array.isArray(req.files) ? req.files : [req.files];
        const paths = files.map((file) => file.path);
        return res.status(200).json({
            success: true,
            data: paths,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});
export default router;
//# sourceMappingURL=uploadRoutes.js.map