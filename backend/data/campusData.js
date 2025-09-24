 const campusData ={
    campuses: [
        {
            id: "main",
            name: "Potchefstroom Campus",
            location: {
                city: "Potchefstroom",
                province: "North West",
                zipCode: "2520"
            },

            openingHours: {
                weekdays: { open: "08:00", close: "20:00" },
                saturday: { open: "10:00", close: "16:00" },
                sunday: { open: "12:00", close: "16:00" }
            },
            
            media: {
                images: [
                    "https://example.com/images/potchefstroom1.jpg"
                ]
            }
        },
        {
            id: "vaal",
            name: "Vanderbijlpark Campus",
            location: {
                city: "Vanderbijlpark",
                province: "Gauteng",
                zipCode: "1900"
            },

            openingHours: {
                weekdays: { open: "08:00", close: "20:00" },
                saturday: { open: "10:00", close: "16:00" },
                sunday: { open: "12:00", close: "16:00" }
            },

            media: {
                images: [
                    "https://example.com/images/vanderbijlpark1.jpg"
                ]
            }
        },
        {
            id: "maftown",
            name: "Mafikeng Campus",
            location: {
                city: "Mafikeng",
                province: "North West",
                zipCode: "2745"
            },
            openingHours: {
                weekdays: { open: "08:00", close: "20:00" },
                saturday: { open: "10:00", close: "16:00" },
                sunday: { open: "12:00", close: "16:00" }
            },
            media: {
                images: [
                    "https://example.com/images/mafikeng1.jpg"
                ]
            }
        }
        
    ],


}
module.exports = { campusData }; // Export the campusData object