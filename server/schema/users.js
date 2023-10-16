const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const users = new mongoose.Schema({

    name : {
        type:String,
        required : true
    },
    regno :{
        type:String,
        required :true
    },
    phone :{
        type :Number,
        required :true
    },
    email : {
        type :String,
        required :true
    },
    submitItemData :[{
        date:{
            type:String,
            required : true
        },
        itemName:{
            type:String,
            required:true
        },
        location:{
            type:String,
            required:true
        },
        description:{
            type:String,
            required:true
        }

    }],
    password :{
        type :String,
        required :true
    },
   conpassword : {
        type : String,
        required : true
    },

    tokens :[{
        token:{
            type : String,
            required : true
        }
    }]
})

// hashing the password

users.pre('save', async function(next) {
    if (this.isModified('password')) {
      const hashedPassword = await bcrypt.hash(this.password, 12);
      const hashedConpassword = await bcrypt.hash(this.conpassword, 12);
      this.password = hashedPassword;
      this.conpassword = hashedConpassword;
    }
    next();
  });
users.methods.generateAuthToken = async function () {
	try{
		let token = jwt.sign({_id:this._id}, process.env.SECRET_KEY)
        this.tokens = this.tokens.concat({token:token})
        await this.save();
        return token
	}catch (err){
		console.log(err)
	}
}
users.methods.addMessage = async function (date,itemName,location,description){
    try{
        this.submitItemData = this.submitItemData.concat({date,itemName,location,description})
        await this.save();
        return this.submitItemData
    }catch(err){
        console.log(err);
    }
}
const User = mongoose.model('USER', users)
module.exports = User;