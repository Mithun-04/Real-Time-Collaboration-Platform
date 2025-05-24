import { Schema, model } from 'mongoose';

const userschema = new Schema({
    name: {
        type: String,
        unique:true,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["user", "manager", "admin"],
        default: "user"
    },
    projects: [
        {
            projectId: {
                type: Schema.Types.ObjectId,
                ref: 'Project',
                required: true
            },
            role: {
                type: String,
                enum: ["manager", "member"],
                required: true
            }
        }
    ]
    ,
    createdAt: {
        type: Date, default: Date.now
    },
    updatedAt: {
        type: Date, default: Date.now
    }
});


userschema.pre('save', function(next){
    this.updatedAt = Date.now;
    next();
})

export default model('User', userschema);