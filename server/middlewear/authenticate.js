const jwt = require("jsonwebtoken");
const User = require("../schema/users");
const Authenticate = async(req,res,next)=>{
    try{
        const token = req.cookies.jwtoken; 
        const verifyToken = jwt.verify(token, process.env.SECRET_KEY); 
        const rootUser = await User.findOne({_id:verifyToken._id, "tokens.token":token})
        if (!rootuser) {throw Error("User not found") }
        req.token = token
        req.rootUser = rootUser
        req.userID = rootUser._id;
        next();
    }catch(err){
        res.status(401).send("Unauthorized token")
        console.log(err);
    }
};

module.exports = Authenticate;