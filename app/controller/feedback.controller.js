const db = require("../models");
const Feedback = db.feedback;
const FeedbackLink = db.feedbackLink;

exports.generateFeedbackLink = async (req, res) => {
  const { retailId } = req.body;

  if (!retailId) {
    return res.status(400).json({ message: "RetailId Is Required" });
  }

  const expiredAt = new Date();
  expiredAt.setDate(expiredAt.getDate() + 2);

  const newLink = await FeedbackLink.create({ retailId, expiredAt });

  res.json({
    message: "link created successfully",
    link: `${process.env.FRONTEND_URL}/feedback/${newLink.token}`,
    token: newLink.token,
    expiredAt,
  });
};

exports.createFeedback = async (req, res) => {
  const { token } = req.params;
  const { rating, message, customerName } = req.body;

  const link = await FeedbackLink.findOne({ token });

  if (!link) return res.status(400).json({ message: "Invalid link" });
  if (link.used)
    return res.status(410).json({ message: "link is already used" });
  if (link.expiredAt < new Date())
    return res.status(410).json({ message: "link has expired" });

  const feedback = await Feedback.create({
    retailId: link.retailId,
    rating,
    message,
    customerName,
  });

  link.used = true;
  link.feedbackId = feedback._id;
  await link.save();
  res.json({ message: "Feedback sent successfully" });
};

exports.getAllFeedback = async (req, res) => {
  try {
    const feedbackList = await Feedback.find().populate("retailId", "carType");
    res.status(200).json(feedbackList);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch feedback", error });
  }
};

exports.getAllFeedbackLinks = async (req, res) => {
  try {
    const link = await FeedbackLink.find()
    .populate({
        path: "retailId",
        select: "spkId salesId carType",
        populate: [
          {
            path: "salesId",
            select: "username", 
          },
          {
            path: "spkId",
            select: "prospekId",
            populate: {
              path: "prospekId",
              select: "name",
            },
          },
        ],
      })
      .populate("feedbackId")
      .sort({ createdAt: -1 });

    res.json(link);
  } catch (error) {
    res.status(500).json({ message: "Failed to Fetch Feedback link" });
  }
};

exports.getTokenInfo = async (req, res) => {
  const { token } = req.params;

  const link = await FeedbackLink.findOne({ token }).populate("retailId");

  if (!link) return res.status(404).json({ message: "Token tidak valid" });
  if (link.used)
    return res.status(410).json({ message: "Link sudah digunakan" });
  if (link.expiredAt < new Date())
    return res.status(410).json({ message: "Link sudah kadaluarsa" });

  res.json({
    message: "Link valid",
    customerName: link.retailId?.customerName ?? "Pelanggan",
    carType: link.retailId?.carType ?? "",
    linkUse: link.used,
  });
};

exports.deleteFeedbackLink = async (req, res) => {
  const { id } = req.params;

  const result = await FeedbackLink.findByIdAndDelete(id);

  if (!result) {
    return res.status(404).json({ message: "Feedback link tidak ditemukan" });
  }

  res.json({ message: "Feedback link berhasil dihapus" });
};
