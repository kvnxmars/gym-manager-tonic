const Class = require('../models/Class');
//import { campusData } from '../../data/campusData'; // Static campus data
const { campusData } = require('../data/campusData'); // Static campus data

class CampusController {

    // GET /api/campus/all
static async getAllCampuses(req, res) {
    try {
        // Campus API deprecated — return 410 Gone with guidance
        return res.status(410).json({ message: 'Campus API has been removed. Please use the Classes endpoints without campus filtering.' });
    } catch (error) {
        console.error("Error loading campus data:", error);
        res.status(500).json({
            message: "Server error loading campus data",
            error: error.message
        });
    }
}

    /// GET /api/campus/:campusId
static async getCampusById(req, res) {
    try {
        return res.status(410).json({ message: 'Campus API has been removed.' });
    } catch (error) {
        console.error("Error fetching campus:", error);
        res.status(500).json({
            message: "Server error fetching campus",
            error: error.message
        });
    }
}

    // GET /api/campus/:campusId/schedule
    static async getCampusSchedule(req, res) {
        try {
            return res.status(410).json({ message: 'Campus API has been removed.' });
        } catch (error) {
            console.error("Error fetching campus schedule:", error);
            res.status(500).json({
                message: "Server error fetching campus schedule",
                error: error.message
            });
        }
    }

     

    // GET /api/campus/analytics
    static async getCampusAnalytics(req, res) {
        try {
            const { startDate, endDate } = req.query;
            
            let dateFilter = {};
            if (startDate || endDate) {
                dateFilter.date = {};
                if (startDate) dateFilter.date.$gte = new Date(startDate);
                if (endDate) dateFilter.date.$lte = new Date(endDate);
            }

            const analytics = await Class.aggregate([
                { $match: { status: 'active', ...dateFilter } },
                {
                    $group: {
                        _id: '$campus',
                        totalClasses: { $sum: 1 },
                        totalCapacity: { $sum: '$capacity' },
                        totalBooked: { $sum: { $size: '$bookedStudents' } },
                        averageCapacity: { $avg: '$capacity' },
                        categories: { $addToSet: '$category.type' }
                    }
                },
                {
                    $addFields: {
                        utilizationRate: {
                            $round: [
                                { $multiply: [
                                    { $divide: ['$totalBooked', '$totalCapacity'] },
                                    100
                                ]},
                                2
                            ]
                        }
                    }
                },
                { $sort: { totalClasses: -1 } }
            ]);

            res.json({ analytics });
        } catch (error) {
            console.error("Error fetching campus analytics:", error);
            res.status(500).json({
                message: "Server error fetching campus analytics",
                error: error.message
            });
        }
    }

    // Helper method to get campus statistics
    static async _getCampusStats(campusName) {
        try {
            const totalClasses = await Class.countDocuments({
                campus: campusName,
                status: 'active'
            });

            const upcomingClasses = await Class.countDocuments({
                campus: campusName,
                status: 'active',
                date: { $gte: new Date() }
            });

            const todayClasses = await Class.countDocuments({
                campus: campusName,
                status: 'active',
                date: {
                    $gte: new Date().setHours(0, 0, 0, 0),
                    $lt: new Date().setHours(23, 59, 59, 999)
                }
            });

            // Get capacity utilization
            const capacityStats = await Class.aggregate([
                { 
                    $match: { 
                        campus: campusName, 
                        status: 'active',
                        date: { $gte: new Date() }
                    } 
                },
                {
                    $group: {
                        _id: null,
                        totalCapacity: { $sum: '$capacity' },
                        totalBooked: { $sum: { $size: '$bookedStudents' } }
                    }
                }
            ]);

            const utilizationRate = capacityStats.length > 0 ? 
                ((capacityStats[0].totalBooked / capacityStats[0].totalCapacity) * 100).toFixed(1) : 0;

            return {
                totalClasses,
                upcomingClasses,
                todayClasses,
                utilizationRate,
                totalCapacity: capacityStats[0]?.totalCapacity || 0,
                totalBooked: capacityStats[0]?.totalBooked || 0
            };
        } catch (error) {
            console.error("Error getting campus stats:", error);
            return {
                totalClasses: 0,
                upcomingClasses: 0,
                todayClasses: 0,
                utilizationRate: 0,
                totalCapacity: 0,
                totalBooked: 0
            };
        }
    }
}

module.exports = CampusController;