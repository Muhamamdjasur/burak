import mongoose, { Schema } from "mongoose";
import { ViewGroup } from "../libs/enums/view.enum";

const viewSchema = new Schema({
    viewGroup: {
        type: String,
        enum: ViewGroup,
        required: true
    },
    productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    memberId: {
        type: Schema.Types.ObjectId,
        ref: "Member",
        required: true
    },
    viewRefId: {
        type: Schema.Types.ObjectId,
        ref: "View",
        required: true
    }
},
   { timestamps: true } // updatedAt, createdAt
); 

export default mongoose.model("View", viewSchema);