import mongoose, {Schema} from "mongoose";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const userSchema= Schema({
    
    watchHistory:[
            {
                type: Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
    userName:{
        type: String,
        required: true,
        lowecase: true,
        trim: true,
        unique: true
    },
    fullName:{
        type: String,
        required: true,
        trim: true,
        index: true
    },
    email:{
        type:String,
        required: true,
        unique: true,
        trim: true
    },
    avatar:{
        type: String,
        required: true
    },
    coverImage:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: [true, "password is required"]
    },
    refreshToken:{
        type: String
    }
},{timestamps: true})

userSchema.pre("save", function (next){
        if(!this.isModified("password")) return next()
        this.password= bcrypt.hash(this.password, 10)
        next();
})

userSchema.methods.isPasswordCorrect=
    async function (password){
        return await bcrypt.compare(password, this.password)
    }

userSchema.methods.generateAccessToken=
async function(){
    return await jwt.sign({
            _id: this.id,
            email: this.email,
            fullName: this.fullName,
            userName: this.userName
    },
process.env.ACCESS_TOKEN_SECRET,
{
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY
})
}

userSchema.methods.generateRefreshToken=
async function(){
    return await jwt.sign({
        _id: this.id,
},
process.env.REFRESH_TOKEN_SECRET,
{
expiresIn: process.env.REFRESH_TOKEN_EXPIRY
})
}


export const User= mongoose.model("User", userSchema);