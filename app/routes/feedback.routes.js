const router = require('express').Router();
const feedbackController = require('../controller/feedback.controller')

// ✅ 1. Generate Feedback Link
router.post("/generate", feedbackController.generateFeedbackLink);

// ✅ 2. Validasi Token (digunakan oleh frontend sebelum tampilkan form)
router.get("/token-info/:token", feedbackController.getTokenInfo);

// ✅ 3. Ambil Semua Feedback Link (beserta data retail)
router.get("/", feedbackController.getAllFeedbackLinks);

// ✅ 4. Ambil semua hasil feedback
router.get("/results", feedbackController.getAllFeedback);

// ✅ 5. Hapus Feedback Link (jika perlu)
router.delete("/:id", feedbackController.deleteFeedbackLink);

// ✅ 6. Kirim Feedback Berdasarkan Token (ROUTE DINAMIS HARUS PALING BAWAH)
router.post("/:token", feedbackController.createFeedback);

module.exports = router;
