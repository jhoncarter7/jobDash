import {Schema, model} from "mongoose"

interface ApplicationI{
    candidateId: Schema.Types.ObjectId,
    jobId: Schema.Types.ObjectId,
    resumeUrl: String,
    parsed_fields: object
}

const applicationSchema = new Schema<ApplicationI>({
    candidateId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    jobId: {
        type: Schema.Types.ObjectId,
        ref: "Job",
        required: true
    },
    resumeUrl: {
        type: String, 
       required: true
    },
    parsed_fields: {
        type: Schema.Types.Mixed
    }
})

export const Application = model<ApplicationI>("Application", applicationSchema);
