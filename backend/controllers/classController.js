//controllers/classController.js
//const campusData =  '../../data/campusData'; // Static campus data
const Student = require("../models/Student");
const Booking = require("../models/Booking");
const { saslprep } = require("@mongodb-js/saslprep");
const Class = require("../models/Class");

//====CLASS MANAGEMENT ROUTES====//

class ClassController {

    //GET api/classes/campuses - Get all campuses
    static async getCampuses(req, res) {
        try {
            res.json({ campuses });
        }
        catch (err) {
            console.error("Error fetching campuses:", err);
            res.status(500).json({ 
                message: "Server error fetching campuses",
                error: err.message
             });
        }
    }

    //POST api/classes/create - Create a new class
    static async createClass(req, res) {
        try {
            const {
                classId,
                name,
                instructor,
                capacity,
                campus,
                time,
                duration,
                date,
                location,
                description,
                category,
                image = ""
            } = req.body;

            //validate required fields
            const requiredFields = { name, instructor, capacity, campus, time, duration, date, category };
            const missingFields = requiredFields.filter(field => !req.body[field]);

            if (missingFields.length > 0) {
                return res.status(400).json({ message: `Missing required fields: ${missingFields.join(", ")}` 
            });
        }

        //generate unique classId
        const generateClassId = classId || `CLS-${Date.now()}`.slice(-8);      
    
        const newClass = new Class({
            classId: generateClassId,
            name,
            instructor,
            capacity: parseInt(capacity),
            booked: 0,
            spaceLeft: parseInt(capacity),
            campus,
            time,
            duration: parseInt(duration),
            date: date ? new Date(date) : Date.now(),
            description: description || '',
            category: category || {
                primary: 'General',
                level: 'Beginner',
                intensity: 'Low'
            },
            image,
            bookedStudents: [],
            instructorDetails: { name: instructor, contact: '', specialty: 'Other', photo: ''}
            });

            await newClass.save();
            res.status(201).json({ 
                message: "Class created successfully", 
                class: newClass 
            });
        
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
    static async getAllClasses(req, res) {
        try {
            const { date, campus } = req.query;
            let filter = { status: 'active' };

            if (date) {
                const searchDate = new Date(date);
                const nextDay = new Date(searchDate);
                nextDay.setDate(nextDay.getDate() + 1);
                filter.date = { 
                    $gte: searchDate, 
                    $lt: nextDay 
                };
            }

            if (campus) {
                filter.campus = campus;
            }

            const classes = await Class.find(filter)
            .sort({ date: 1, time: 1 })
            .populate('bookedStudents', 'studentNumber name.first name.last');

            res.json({ classes });
        } catch (err) {
            console.error("Error fetching classes:", err);
            res.status(500).json({ 
                message: "Server error fetching classes",
                error: err.message
             });
            
        }

    
    }
    
    //GET /api/classes/campus/:campusName - Get classes by campus
    static async getClassesByCampus(req, res) {
        try {
            const { campusName } = req.params; // Campus name from URL parameter
            const { date } = req.query; // Optional date filter

            let filter = {
                campus: campusName,
                status: 'active'
            };

            if (date) {
                const searchDate = new Date(date);
                const nextDay = new Date(searchDate);
                nextDay.setDate(nextDay.getDate() + 1);
                filter.date = { 
                    $gte: searchDate, 
                    $lt: nextDay 
                };
            }

            const classes = await Class.find(filter)
                .populate('bookedStudents', 'studentNumber name.first name.last') // Populate bookedStudents with studentNumber and name
                .sort({ date: 1, time: 1 }); // Sort by date and time ascending

            res.json({ classes }); // Send the classes as JSON response
        } catch (err) {
            console.error("Error fetching classes by campus:", err);
            res.status(500).json({ 
                message: "Server error fetching classes by campus",
                error: err.message
             });
        }
    }

    //GET api/classes/student/:studentId - Get classes booked by a student
    static async getStudentClasses(req, res) {
        try {
            const { studentId } = req.params;

            const classes = await Class.find({ 
                bookedStudents: studentId, 
                status: 'active' 
            }).populate('bookedStudents', 'studentNumber name.first name.last'); // Populate bookedStudents with studentNumber and name

            //transform to match frontend expectations
            const bookings = classes.map(cls => ({
                bookingId: `${cls._id}_${studentId}`,
                ...cls.toObject(), // Convert Mongoose document to plain object
                bookingDate: cls.date,
                status: 'booked'
            }));

            res.json({ bookings });
        } catch (err) {
            console.error("Error fetching student classes:", err);
            res.status(500).json({ 
                message: "Server error fetching student classes",
                error: err.message
             });
        }
    }

    // POST api/classes/book - Book a class
    static async bookClass(req, res) {
        try {
            const { studentId, classId, date } = req.body;
            
            // Validate required fields
            if (!studentId || !classId || !date) {
                return res.status(400).json({
                    message: "Student ID, Class ID, and Date are required to book a class."
                });
            }

            //find student
            const student = await Student.findById(studentId);
            if (!student) {
                return res.status(404).json({ message: "Student not found." });
            }

            //find class
            const cls = await Class.findById(classId);
            if (!cls || cls.status !== 'active') {
                return res.status(404).json({ message: "Class not found or is not active." });
            }

            //check if class is full 
            if (cls.bookedStudents.length >= cls.capacity) {
                return res.status(400).json({ message: "Class is fully booked." });
            }

            //check if student already booked
            if (cls.bookedStudents.includes(studentId)) {
                return res.status(400).json({ 
                    message: "Student has already booked this class." 
                });
            }

            //add student to class
            cls.bookedStudents.push(studentId);
            await cls.save(); // Save the updated class document

            //create booking record
            let bookingId = `BK${Date.now()}`;

            try {
                const booking = new Booking
                ({
                    bookingId,
                    student: 
                    {
                        id: student._id,
                        studentNumber: student.studentNumber,
                        name: 
                        {
                            first: student.name.first
                        }
                },
                class: {
                    id: classId,
                    name: cls.name,
                    instructor: cls.instructor,
                    date: cls.date,
                    duration: cls.duration,
                    campus: cls.campus
                },

                booking: {
                    status: 'booked',
                    source: 'app'
                    }
                });
                
                await booking.save();
                bookingId = booking.bookingId; // Use the generated bookingId from the saved booking
            }
            catch (err) 
            {
                console.error("Error creating booking record:", err);
                //rollback student addition to class
                cls.bookedStudents = cls.bookedStudents.filter(id => id.toString() !== studentId);
                await cls.save();
                return res.status(500).json
                ({ 
                    message: "Server error creating booking record",
                    error: err.message
                 });
            }

            res.status(200).json({
                message: "Class booked successfully.",
                class: cls,
                bookingId
            });
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
    // DELETE api/classes/cancel - Cancel a class booking
    static async cancelBooking(req, res) {
        try {
            const { bookingId } = req.params;
            const { studentId } = req.body;

            // try to find by bookingId first
            let booking = await Booking.findOne({ bookingId });

            if (booking) {
                //update booking status
                booking.booking.status = 'cancelled';
                booking.cancellation = {
                    cancelledAt: new Date(),
                    reason: 'Cancelled by user'
                };
                await booking.save();

                //remove student from class
                const cls = await Class.findById(booking.class.id);
                if (cls) {
                    cls.bookedStudents = cls.bookedStudents.filter(
                        id => id.toString() 
                        !== booking.student.id.toString()
                    );
                    await cls.save();
                }

                return res.json({ 
                    message: "Booking cancelled successfully.", 
                    booking 
                });
            }

            //fallback: try to parse (legacy) classId and studentId from bookingId
            if(bookingId.includes('_')) {
                const [classId, studentIdFromId] = bookingId.split('_');

                const cls = await Class.findById(classId);
                if (!cls) {
                    return res.status(404).json({ message: "Class not found." });
                }

                const studentNumberToUse = studentnumberFromId || studentId;
                if (!studentNumberToUse) {
                    return res.status(400).json({ message: "Student ID is required to cancel booking." });
                }

                //booking not found
                if (!cls.bookedStudents.includes(studentNumberToUse)) {
                    return res.status(404).json({ message: "Booking not found for this student in the specified class." });
                }

                //save booking record
                cls.bookedStudents = cls.bookedStudents.filter(
                    id => id.toString() !== studentNumberToUse.toString()
                );
                await cls.save();

                return res.status(200).json({
                    message: "Booking cancelled successfully.",
            });
        }
        else {
            return res.status(404).json({ message: "Booking not found." });
        }
    }catch (err) {
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
                .populate('class.id', 'name isntructor campus')
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