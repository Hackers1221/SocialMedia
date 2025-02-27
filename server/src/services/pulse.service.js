const pulsemodel = require('../models/pulse.model');

const CreatePulse = async (data) => {
    const response = {};
    try {
        const pulseResponse = await pulsemodel.create(data);
        
        if (!pulseResponse) {
            response.error = "Pulse not created";
        } else {
            response.success = true;
            response.pulse = pulseResponse;
        }
    } catch (error) {
        console.log(error);
        response.error = error.message;
    }
    return response;  
};

const getAllPulse = async () => {
    const response = {};
    try {
        const allPulse = await pulsemodel.find({});
        
        if (!allPulse || allPulse.length === 0) {
            response.error = "No pulse available";
        } else {
            response.success = true;
            response.pulse = allPulse;
        }
    } catch (error) {
        response.error = error.message;
    }
    return response;  
};

module.exports = {
    CreatePulse,
    getAllPulse,
};
