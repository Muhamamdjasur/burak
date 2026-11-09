import mongoose, { Schema } from "mongoose";
import { ViewGroup } from "../libs/enums/view.enum";

const viewSchema = new Schema(
    {
        viewGroup: {
            type: String,
            enum: ViewGroup,
            required: true,
        },
        memberId: {
            type: Schema.Types.ObjectId,
            ref: "Member",
            required: true,
        },
        viewRefId: {
            type: Schema.Types.ObjectId,
            required: true,
        },
    },
    { timestamps: true } // updatedAt, createdAt
);

// one view log per member per target
viewSchema.index({ memberId: 1, viewRefId: 1, viewGroup: 1 }, { unique: true });

export default mongoose.model("View", viewSchema);
