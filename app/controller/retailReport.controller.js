const { getDateRange } = require('../utils/dateRange');
const db = require('../models');
const Retail = db.retail;
const logger = require('../utils/logger');


exports.retail = async(req, res) => {
    try {
        const { month, year } = req.query;

         if(!month || !year) {
            return res.status(400).json({message: 'month and yeaar is required!'});
        }

        const { startDate, endDate } = getDateRange(month, year);

        const retail = await Retail.find({
            createdAt: {
                $gte: startDate,
                $lte: endDate
            }
        }).populate('salesId','username').populate({
          path: "spkId",
          select: "prospekId",
          populate: {
            path: "prospekId",
            select: "name",
          },
        })
        
        res.json({
            count: retail.length,
            data: retail,
        });
    } catch (error) {
        logger.error('failed to retrieve retail report', error);
        res.status(500).json({message: 'There was an error retrieving retail report data.'})

    }
}