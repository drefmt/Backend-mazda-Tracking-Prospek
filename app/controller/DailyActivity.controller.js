const db = require("../models");
const DailyActivity = db.dailyActivity;
const logger = require("../utils/logger");

exports.createActivity = async (req, res) => {
  try {
    const salesId = req.user.id;
    const salesName = req.user.username;

    const { date, activityType, description, location, notes } = req.body;
    const newActivity = new DailyActivity({
      salesId,
      date,
      activityType,
      description,
      location,
      notes,
    });

    const Activity = await newActivity.save();
    res.status(201).json({
      message: "The activity was saved successfully",
      data: Activity,
    });
  } catch (error) {
    logger.error("error when creating activity");
    res.status(500).json({ message: error.message });
  }
};

exports.findAllActivity = async (req, res) => {
  try {
    const salesId = req.user.id;
    const userRole = req.user.level;
    
    let activitys;

    if (userRole === "svp") {
      activitys = await DailyActivity.find()
        .populate("salesId", "username level")
        .sort({ createdAt: -1 });
    } else {
      activitys = await DailyActivity.find({ salesId })
        .populate("salesId", "username level")
        .sort({ createdAt: -1 });
    }

    res.status(200).json(activitys);
  } catch (error) {
    logger.error("error while retrieving activity");
    res.status(500).json({ message: error.message });
  }
};

exports.findActivityById = async(req, res) => {
    try {
        const salesId = req.user.id;
        const { id } = req.params;
        const userRole = req.user.level;

        let foundActivity;
        if(userRole === "svp") {
            foundActivity = await DailyActivity.findById(id).populate("salesId","username level");
        } else {
            foundActivity = await DailyActivity.findOne({_id: id, salesId});
        }

        if(!foundActivity) {
            logger.warn('no activity found for id')
            return res.status(404).json({ message: "Activity not found" });
        }
        res.status(200).json(foundActivity);
    } catch (error) {
        logger.error(`error while searching for activity by id: ${error.message}`);
        res.status(500).json({message: error.message});
    }
}


exports.updateActivity = async (req, res) => {
  try {
    const salesId = req.user.id;
    const userRole = req.user.level;
    const { id } = req.params;

    let updatedActivity;

    if (userRole === "svp") {
      updatedActivity = await DailyActivity.findByIdAndUpdate(id, req.body, { new: true });
    } else {
      updatedActivity = await DailyActivity.findOneAndUpdate(
        { _id: id, salesId },
        req.body,
        { new: true }
      );
    }

    if (!updatedActivity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    res.status(200).json({
      message: "Activity updated successfully",
      data: updatedActivity,
    });
  } catch (error) {
    logger.error(`error while updating activity: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};


exports.deleteActivity = async (req, res) => {
  try {
    const salesId = req.user.id;
    const userRole = req.user.level;
    const { id } = req.params;

    let deletedActivity;

    if (userRole === "svp") {
      deletedActivity = await DailyActivity.findByIdAndDelete(id);
    } else {
      deletedActivity = await DailyActivity.findOneAndDelete({ _id: id, salesId });
    }

    if (!deletedActivity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    res.status(200).json({ message: "Activity deleted successfully" });
  } catch (error) {
    logger.error(`error while deleting activity: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};


