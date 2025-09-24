const mongoose = require('mongoose');

//campus schema
//collection: campuses
const CampusSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        enum: ['Potchefstroom', 'Vanderbijlpark', 'Mafikeng'] // The actual campus names

    }, // Name of the campus
    location: {
        city: {
            type: String
        },
        province: {
            type: String
        },
        zipCode: {
            type: String    
        }
        
    }, // Physical location or address of the campus

    // operating hours
    operatingHours: {
        weekdays: {
            open: { type: String, default: '08:00' }, // Default opening time
            close: { type: String, default: '20:00' } // Default closing time
        },
        saturday: {
            open: { type: String, default: '10:00' }, // Default opening time
            close: { type: String, default: '16:00' } // Default closing time
        },
        sunday: {
            open: { type: String, default: '12:00' }, // Default opening time
            close: { type: String, default: '16:00' } // Default closing time
        }
    },

    // pictures and media
    media: {
        images: [String], // Array of image URLs
        videos: [String]  // Array of video URLs
    },

    //system fields
    createdAt: {
        type: Date,
        default: Date.now
    },

    updatedAt: {
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.models.Campus || mongoose.model('Campus', CampusSchema);