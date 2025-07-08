const { getDateRange } = require('../utils/dateRange');
const db = require('../models');
const logger = require('../utils/logger');
const TestDrive = db.testDrive;


exports.testDriveReport = async(req, res) => {
    try {
        const { month, year } = req.query;

        if(!month || !year) {
            return res.status(400).json({message: 'month and yeaar is required!'});
        }

        const { startDate, endDate } = getDateRange(month, year);

        const testDrive = await TestDrive.find({
            createdAt: {
                $gte: startDate,
                $lte: endDate
            }
        }).populate('salesId', 'username');

        res.json({
            count: testDrive.length,
            data: testDrive
        })
    } catch (error) {
        logger.error('failed to retrieve test drive report', error);
        res.status(500).json({message: 'There was an error retrieving the test drive report data.'})
    }
}