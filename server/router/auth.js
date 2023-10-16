const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const authenticate = require("../middlewear/authenticate");
require("../db/conn")
const User = require("../schema/users")
router.get('/', (req, res ) => {res.send('hello this is hari from server')} )
router.post('/register', async (req, res ) => {
    const {name,regno,phone,email,password,conpassword} = req.body
    if(!name || !regno || !phone || !email || !password || !conpassword){
        return res.status(422).json({error:"please fill all the details"})
    }
    try{
        const userExists = await User.findOne({email:email})
        const idExists = await User.findOne({regno:regno})
        if(userExists || idExists){
            return res.status(422).json({error:"User already exists"})
        }
        else if(password!=conpassword){
            return res.status(422).json({error:"doesnt match with password!..."})
        }
        else{
            const user = new User({name,regno,phone,email,password,conpassword})
            await user.save()
            res.status(201).json({message : "Successfully registered"})
        }
       

    } catch(err){
        console.log(err);
    }
} )
//login route
router.post("/signin", async (req, res) => {
    try {
        const {email, password} = req.body;
        if (!email || !password) {
            return res.status(400).json({error: "Invalid crendentials"})
        }
        const userLogin = await User.findOne({email:email})
        if (userLogin) {
            const isMatch = await bcrypt.compare(password, userLogin.password);
            const token = await userLogin.generateAuthToken();
            console.log(token)
            res.cookie("jwtoken",token,{
                expires:new Date(Date.now()+1800),
                httpOnly:true
            })
            if(!isMatch){
                return res.status(400).json({error: "Invalid crendentials"})
            }
            else{
                res.json({message: "login successful"})   
            }
        }else {
            return res.status(400).json({error: "Invalid crendentials"})
        }
    } catch (err) {
        console.log(err);
    }
})
router.get('/getdata', authenticate, async(req, res) => {
	res.send(req.rootUser)
});
router.post('/submitItem', authenticate, async(req, res) => {
    try{
        const {date,itemName,location,description} = req.body
        if(!date || !itemName || !location || !description ){
            return res.json({error:"Please fill all details"})
        }
        const person = await User.findOne({_id:req.userID})
        if(person){
            const submitData = await person.addMessage(date,itemName,location,description);
            await person.save();
            res.status(201).json({message:"Item submitted successfully"})
        }

    }catch(err){
        console.log(err);
    }
});
module.exports = router;
