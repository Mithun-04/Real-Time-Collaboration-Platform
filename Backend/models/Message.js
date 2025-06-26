import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    projectId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Project", 
      required: true 
    },
    senderId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User" 
    },
    content: { 
      type: String,
      required: true,
      trim: true
    },
  },
  { 
    timestamps: true // Automatically adds createdAt & updatedAt
  }
);

// Export the Message model properly for ES Modules
const Message = mongoose.model("Message", messageSchema);
export default Message;
