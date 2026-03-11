import mongoose from "mongoose";

import bcrypt from 'bcryptjs'
import { PasswordException } from "pdf-parse";

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true,'please provide a username'],
        unique:true,
        trim:true,
        minlength:[3,'username must be at least 3 characters']
    },
    email:{
        type:String,
        required:[true,'please provide an email'],
        unique:true,
        lowercase:true,
        match:[/^\S+@\S+\.\S+$/,'please provide valid email']
    },
    password:{
        type:String,
        required:[true,"Please provide a password"],
        minlength:[6,"password must be at least 6 characters long"],
        select:false
    },
    profileImage:{
        type:String,
        default:null
    }

},{
    timestamps:true,
});

userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        next();
    }

const salt = await bcrypt.genSalt(10);
this.password = await bcrypt.hash(this.password,salt)
 next();

})

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}


const User = mongoose.model('User',userSchema)

export default User;