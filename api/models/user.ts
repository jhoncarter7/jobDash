import {model, Schema} from "mongoose"

interface userInterface{
    email: string,
    password: string,
    role: 'recruiter' | 'candidate'
}

const userSchema = new Schema<userInterface>({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum:["recruiter", "candidate"],
        required: true
    }
})

export const User = model<userInterface>("User", userSchema)