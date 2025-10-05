//controllers/classController.js
//const campusData =  '../../data/campusData'; // Static campus data
const User = require("../models/User");
const Booking = require("../models/Booking");
const Class = require("../models/Class");

//====CLASS MANAGEMENT ROUTES====//

class ClassController {

    
    //POST api/classes/create - Create a new class
    
    static async createClass(req, res) {
        try {
            const {
                classId,
                name,
                instructor,
                capacity,
                time,
                duration,
                date,
                location,
                description,
                category,
                image = ""
            } = req.body;

            console.log('Received request body:', req.body);

            // campus has been deprecated/removed from classes — ignore any campus value sent by clients

            // Determine whether a full schedule object was provided
            const scheduleProvided = !!req.body.schedule;

            // Build list of required field NAMES (strings) depending on payload shape
            const requiredNames = ['name', 'instructor', 'capacity', 'date', 'category'];
            if (!scheduleProvided) {
                // If no schedule object, time and duration are required
                requiredNames.push('time', 'duration');
            }

            // Compute missing fields by looking up the keys on req.body
            const missingFields = requiredNames.filter(key => {
                const value = req.body[key];
                return value === undefined || value === null || (typeof value === 'string' && value.trim() === '');
            });
            console.log('Required field names:', requiredNames);
            console.log('Missing fields:', missingFields);

            if (missingFields.length > 0) {
                return res.status(400).json({ message: `Missing required fields: ${missingFields.join(', ')}` });
            }

            // Normalize instructor - support both string and object formats
            let instructorDetails;
            if (typeof instructor === 'string') {
                instructorDetails = {
                    name: instructor,
                    contact: '',
                    specialty: 'Other',
                    photo: ''
                };
            } else if (typeof instructor === 'object' && instructor.name) {
                instructorDetails = {
                    name: instructor.name,
                    contact: instructor.contact || '',
                    specialty: instructor.specialty || 'Other',
                    photo: instructor.photo || ''
                };
            } else {
                return res.status(400).json({ message: "Invalid instructor format. Provide either a string or object with 'name' property." });
            }

            // Normalize category - support string or object
            let categoryObj;
            if (typeof category === 'string') {
                categoryObj = { primary: category, level: 'Beginner', intensity: 'Low' };
            } else if (typeof category === 'object') {
                categoryObj = {
                    primary: category.primary || 'General',
                    level: category.level || 'Beginner',
                    intensity: category.intensity || 'Low'
                };
            } else {
                categoryObj = { primary: 'General', level: 'Beginner', intensity: 'Low' };
            }

            // Build schedule object: prefer req.body.schedule but accept flattened fields
            let scheduleObj = {};
            if (scheduleProvided && typeof req.body.schedule === 'object') {
                scheduleObj = {
                    days: Array.isArray(req.body.schedule.days) ? req.body.schedule.days : (req.body.schedule.days ? [req.body.schedule.days] : []),
                    type: req.body.schedule.type || (req.body.type || 'In-Person'),
                    frequency: req.body.schedule.frequency || (req.body.frequency || 'Once'),
                    time: req.body.schedule.time || time || '',
                    duration: parseInt(req.body.schedule.duration || duration || 0)
                };
            } else {
                scheduleObj = {
                    days: Array.isArray(req.body.days) ? req.body.days : (req.body.days ? [req.body.days] : []),
                    type: req.body.type || 'In-Person',
                    frequency: req.body.frequency || 'Once',
                    time: time || '',
                    duration: parseInt(duration || 0)
                };
            }

            //generate unique classId
            const generateClassId = classId || `CLS-${Date.now()}`.slice(-8);

            const newClass = new Class({
                classId: generateClassId,
                name,
                description: description || '',
                date: date ? new Date(date) : Date.now(),
                capacity: parseInt(capacity),
                category: categoryObj,
                instructor: instructorDetails,
                schedule: scheduleObj,
                image: image || '',
                booked: 0,
                spaceLeft: parseInt(capacity),
                bookedStudents: []
            });

            await newClass.save();
            res.status(201).json({ message: 'Class created successfully', class: newClass });
        }
        catch (err) {
            console.error("Error creating class:", err);

            if (err.code === 11000) {
                return res.status(400).json({ message: "Class ID already exists. Please use a unique Class ID." });
            }

            res.status(500).json({
                message: "Server error creating class",
                error: err.message
             });
        }
    }
    

    //GET api/classes - all classes despite campus
    
// New code in classController.js

static async getAllClasses(req, res) {
    
    try {
        const { date} = req.query;

        // Base filter
        let filter = { status: 'active' };

        if (date) {
            // ... (date filtering logic)
            const searchDate = new Date(date);
            const nextDay = new Date(searchDate);
            nextDay.setDate(nextDay.getDate() + 1);

            filter.date = {
                $gte: searchDate,
                $lt: nextDay
            };
        }

       
        const classes = await Class.find({});

        // FIX: Return the classes inside a 'classes' property
        return res.status(200).json({ classes: classes }); // <--- FIXED
        // This will return: { "classes": [...] }

    } catch (error) {
        console.error('Error fetching classes:', error);
        return res.status(500).json({ message: 'Server error fetching classes', error: error.message });
    }
}
    
   
    
    
    //PUT api/classes/update/:classId - Admin updates class details
    static async updateClass(req, res) {
        try {
            const { classId } = req.params;
            const updatedClass = await Class.findOneAndUpdate({ classId: classId }, req.body, { new: true });
            
            if (!updatedClass) {
                 return res.status(404).json({ message: "Class not found for update." });
            }

            res.json({ message: "Class updated successfully.", updatedClass });
        } catch (err) {
            console.error("Error updating class:", err);
            res.status(500).json({ 
                message: "Server error updating class",
                error: err.message
             });
        }
    }

    
    

    // GET api/classes/student/:studentNumber - Get student's bookings
    static async getStudentClasses(req, res) {
        try {
            const { studentNumber } = req.params;

            // Find all classes where this studentNumber is in bookedStudents
            const classes = await Class.find({ 
                bookedStudents: studentNumber,
                status: 'active' 
            });

            // Transform to match frontend expectations
            const bookings = classes.map(cls => ({
                bookingId: `${cls._id}_${studentNumber}`,
                classId: cls._id,
                className: cls.name,
                instructor: cls.instructor,
                date: cls.date,
                time: cls.schedule?.time,
                duration: cls.schedule?.duration,
                location: cls.location,
                status: 'booked'
            }));

            res.json({ bookings });

        } catch (err) {
            console.error("Error fetching student classes:", err);
            res.status(500).json({ 
                message: "Server error fetching bookings",
                error: err.message
            });
        }
    }

    


    // POST api/classes/book - Book a class
    static async bookClass(req, res) {
        try {
            const { studentNumber, classId, date } = req.body;
            
            // Validate required fields
            if (!studentNumber || !classId || !date) {
                return res.status(400).json({
                    message: "Student ID, Class ID, and Date are required to book a class."
                });
            }

            //find student
            const student = await User.findOne({studentNumber: studentNumber});
            if (!student) {
                return res.status(404).json({ message: "Student not found." });
            }

            if (student.role !== 'student') {
                return res.status(403).json({ message: "Only students can book classes" });
            }


            //find class
            const cls = await Class.findById(classId);
            if (!cls || cls.status !== 'active') {
                //return res.status(404).json({ message: "Class not found or is not active." });
            }

            //check if class is full 
            if (cls.bookedStudents.length >= cls.capacity) {
                return res.status(400).json({ message: "Class is fully booked." });
            }

            //check if student already booked
            if (cls.bookedStudents.includes(studentNumber)) {
                return res.status(400).json({ 
                    message: "Student has already booked this class." 
                });
            }

            //add student to class
            cls.bookedStudents.push(studentNumber);
            cls.booked = cls.bookedStudents.length;
            cls.spaceLeft = cls.capacity - cls.booked;
            await cls.save(); // Save the updated class document

            //create booking record
            let bookingId = `BK${Date.now()}`;

            try {
                const booking = new Booking
                ({
                    bookingId,
                    student: 
                    {
                        //id: student._id,
                        studentNumber: student.studentNumber,
                        name: 
                        {
                            first: student.firstName,
                            last: student.lastName
                        }
                },
                class: {
                    id: classId,
                    name: cls.name,
                    instructor: cls.instructor,
                    date: cls.date,
                    duration: (cls.schedule && cls.schedule.duration) ? cls.schedule.duration : cls.duration
                },

                booking: {
                    status: 'booked',
                    source: 'app'
                    }
                });
                
                await booking.save();
                bookingId = booking.bookingId; // Use the generated bookingId from the saved booking

                res.status(200).json({
                    message: "Class booked successfully.",
                    booking: booking,
                    class: cls
                });
            }
            catch (err) 
            {
                console.error("Error creating booking record:", err);
                //rollback student addition to class
                cls.bookedStudents = cls.bookedStudents.filter(
                    num => num !== studentNumber
                );

                cls.booked = cls.bookedStudents.length;
                cls.spaceLeft = cls.capacity - cls.booked;
                await cls.save();

                return res.status(500).json
                ({ 
                    message: "Server error creating booking record",
                    error: err.message
                 });
    

        }
        
            }
            catch (err) 
            {   
                console.error("Error booking class:", err);
                res.status(500).json({ 
                message: "Server error booking class",
                error: err.message
                });
            }

        }
    // DELETE api/classes/cancel/:bookingId - Cancel booking
    static async cancelBooking(req, res) {
        try {
            const { bookingId } = req.params;
            const { studentNumber } = req.body;

            if (!studentNumber) {
                return res.status(400).json({ 
                    message: "Student number is required" 
                });
            }

            // Find booking by bookingId
            const booking = await Booking.findOne({ bookingId });

            if (!booking) {
                return res.status(404).json({ 
                    message: "Booking not found" 
                });
            }

            // Verify the student owns this booking
            if (booking.student.studentNumber !== studentNumber) {
                return res.status(403).json({ 
                    message: "You can only cancel your own bookings" 
                });
            }

            // Update booking status
            booking.booking.status = 'cancelled';
            booking.cancellation = {
                cancelledAt: new Date(),
                reason: 'Cancelled by user'
            };
            await booking.save();

            // Remove student from class bookedStudents array
            const cls = await Class.findById(booking.class.id);
            if (cls) {
                cls.bookedStudents = cls.bookedStudents.filter(
                    num => num !== studentNumber
                );
                cls.booked = cls.bookedStudents.length;
                cls.spaceLeft = cls.capacity - cls.booked;
                await cls.save();
            }

            res.json({ 
                message: "Booking cancelled successfully.", 
                booking 
            });

        } catch (err) {
            console.error("Error cancelling booking:", err);
            res.status(500).json({ 
                message: "Server error cancelling booking",
                error: err.message
            });
        }
    }
// PUT api/classes/update/:classId - Update class details
    static async updateClass(req, res) {
        try {
            const { classId } = req.params;
            const updateData = req.body;

            const updatedClass = await Class.findByIdAndUpdate(
                classId,
                { $set: updateData },
                { new: true, runValidators: true }
            );
        
        if (!updatedClass) {
            return res.status(404).json({ message: "Class not found." });
        }

        res.json({
            message: "Class updated successfully.",
            class: updatedClass
        });
    } catch (err) {
        console.error("Error updating class:", err);
        res.status(500).json({ 
            message: "Server error updating class",
            error: err.message
         });
    }
}

    //DELETE api/classes/delete/:classId - Soft delete a class
    static async deleteClass(req, res) {
        try {
            const { classId } = req.params;

            const cls = await Class.findByIdAndDelete(classId);
            if (!cls) {
                return res.status(404).json({ message: "Class not found." });
            }

            await Booking.updateMany(
                { 'class.id': classId },
                { $set: 
                    { 
                    'booking.status': 'cancelled',
                    'cancellation.cancelledAt': new Date(),
                    'cancellation.reason': 'Class deleted by admin'
                    } 
                }
            );

            res.json({ message: "Class deleted successfully." });
        } catch (err) {
            console.error("Error deleting class:", err);
            res.status(500).json({ 
                message: "Server error deleting class",
                error: err.message
             });
        }
    }

    //GET api/classes/bookings/all - Get all bookings (admin)
    static async getAllBookings(req, res) {
        try {
            const bookings = await Booking.find()
                .populate('student.id', 'studentNumber name.first')
                // 'campus' field removed from class model; also fix instructor spelling
                .populate('class.id', 'name instructor')
                .sort({ 'booking.bookedAt': -1 });

            res.json({ bookings });
        }
        catch (err) {
            console.error("Error fetching all bookings:", err);
            res.status(500).json({ 
                message: "Server error fetching all bookings",
                error: err.message
             });
        }
    }
}

module.exports = ClassController;