const Class = require('../models/Class');
const Campus = require('../models/Campus');

class CampusController {

    // GET /api/campus/all
    static async getAllCampuses(req, res) {
        try {
            // Add real-time class count for each campus
            const campusesWithStats = await Promise.all(
                campusData.map(async (campus) => {
                    const totalClasses = await Class.countDocuments({ 
                        campus: campus.name,
                        status: 'active'
                    });
                    
                    const todayClasses = await Class.countDocuments({
                        campus: campus.name,
                        status: 'active',
                        date: {
                            $gte: new Date().setHours(0, 0, 0, 0),
                            $lt: new Date().setHours(23, 59, 59, 999)
                        }
                    });

                    return {
                        ...campus,
                        totalClasses,
                        todayClasses
                    };
                })
            );

            res.json({ campuses: campusesWithStats });
        } catch (error) {
            console.error("Error fetching campuses:", error);
            res.status(500).json({
                message: "Server error fetching campuses",
                error: error.message
            });
        }
    }

    // GET /api/campus/:campusId
    static async getCampusById(req, res) {
        try {
            const { campusId } = req.params;
            
            const campus = campusData.find(c => c.id === campusId);
            if (!campus) {
                return res.status(404).json({ message: "Campus not found" });
            }

            // Get detailed stats for this campus
            const stats = await CampusController._getCampusStats(campus.name);
            
            res.json({ 
                campus: {
                    ...campus,
                    ...stats
                }
            });
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
            const { campusId } = req.params;
            const { date, week } = req.query;
            
            const campus = campusData.find(c => c.id === campusId);
            if (!campus) {
                return res.status(404).json({ message: "Campus not found" });
            }

            let dateFilter = { status: 'active', campus: campus.name };
            
            if (date) {
                const searchDate = new Date(date);
                const nextDay = new Date(searchDate);
                nextDay.setDate(nextDay.getDate() + 1);
                dateFilter.date = {
                    $gte: searchDate,
                    $lt: nextDay
                };
            } else if (week) {
                // Get week schedule (next 7 days)
                const startOfWeek = new Date();
                const endOfWeek = new Date();
                endOfWeek.setDate(endOfWeek.getDate() + 7);
                
                dateFilter.date = {
                    $gte: startOfWeek,
                    $lt: endOfWeek
                };
            }

            const classes = await Class.find(dateFilter)
                .populate('bookedStudents', 'name studentNumber')
                .sort({ date: 1, time: 1 });

            // Group by date for easier frontend consumption
            const schedule = classes.reduce((acc, cls) => {
                const dateKey = cls.date.toISOString().split('T')[0];
                if (!acc[dateKey]) {
                    acc[dateKey] = [];
                }
                acc[dateKey].push(cls);
                return acc;
            }, {});

            res.json({ 
                campus: campus.name,
                schedule,
                totalClasses: classes.length
            });
        } catch (error) {
            console.error("Error fetching campus schedule:", error);
            res.status(500).json({
                message: "Server error fetching campus schedule",
                error: error.message
            });
        }
    }

    // GET /api/campus/:campusId/facilities
    static async getCampusFacilities(req, res) {
        try {
            const { campusId } = req.params;
            
            const campus = campusData.find(c => c.id === campusId);
            if (!campus) {
                return res.status(404).json({ message: "Campus not found" });
            }

            // Get classes grouped by facility/location
            const classesByFacility = await Class.aggregate([
                { 
                    $match: { 
                        campus: campus.name, 
                        status: 'active',
                        date: { $gte: new Date() }
                    } 
                },
                {
                    $group: {
                        _id: '$location',
                        classes: { $push: '$ROOT' },
                        totalClasses: { $sum: 1 },
                        totalCapacity: { $sum: '$capacity' },
                        totalBooked: { $sum: { $size: '$bookedStudents' } }
                    }
                },
                { $sort: { _id: 1 } }
            ]);

            const facilitiesWithStats = campus.facilities.map(facility => {
                const stats = classesByFacility.find(f => 
                    f._id && f._id.toLowerCase().includes(facility.toLowerCase())
                );
                
                return {
                    name: facility,
                    totalClasses: stats?.totalClasses || 0,
                    totalCapacity: stats?.totalCapacity || 0,
                    totalBooked: stats?.totalBooked || 0,
                    utilizationRate: stats ? 
                        ((stats.totalBooked / stats.totalCapacity) * 100).toFixed(1) : 0
                };
            });

            res.json({ 
                campus: campus.name,
                facilities: facilitiesWithStats,
                locations: classesByFacility
            });
        } catch (error) {
            console.error("Error fetching campus facilities:", error);
            res.status(500).json({
                message: "Server error fetching campus facilities",
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