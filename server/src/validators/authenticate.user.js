
const authservice = require('../services/auth.service')


const isUserAuthenticated = async (req, res, next) => {
    const token = req.headers['x-access-token'];
    if (!token) {
        return res.status(401).send({
            msg: "Token not provided"
        });
    }
    try {
        const verifyToken = await authservice.verfiyJwtToken(token);
        // console.log (verifyToken);
        if (!verifyToken) {
            return res.status(401).json({
                msg: "Token not verified"
            });
        }
        next();
    } catch (error) {
        console.log (error);
        return res.status(500).json({
            msg: "Internal server error"
        });
    }
};

module.exports={
    isUserAuthenticated
}