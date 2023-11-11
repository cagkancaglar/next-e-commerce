import { Document, Model, ObjectId, Schema, model, models } from "mongoose";

interface HistoryDocument extends Document {
  owner: ObjectId;
  items: { product: ObjectId; date: Date }[];
}

const historySchema = new Schema<HistoryDocument>({
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      date: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
});

const HistoryModel = models.History || model("History", historySchema);
export default HistoryModel as Model<HistoryDocument>;
