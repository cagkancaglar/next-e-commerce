import { genSalt, hash, compare } from "bcrypt";
import { Document, ObjectId, Schema, Model, models, model } from "mongoose";

interface PasswordResetTokenDocument extends Document {
  user: ObjectId;
  token: string;
  createdAt: Date;
}

interface Methods {
  compareToken(token: string): Promise<boolean>;
}

const PasswordResetTokenSchema = new Schema<
  PasswordResetTokenDocument,
  {},
  Methods
>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: 60 * 60 * 24,
  },
});

PasswordResetTokenSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("token")) {
      return next();
    }

    const salt = await genSalt(10);
    this.token = await hash(this.token, salt);
    next();
  } catch (err) {
    throw err;
  }
});

PasswordResetTokenSchema.methods.compareToken = async function (
  tokenToCompare
) {
  try {
    return await compare(tokenToCompare, this.token);
  } catch (err) {
    throw err;
  }
};

const PasswordResetTokenModel =
  models.PasswordResetToken ||
  model("PasswordResetToken", PasswordResetTokenSchema);

export default PasswordResetTokenModel as Model<
  PasswordResetTokenDocument,
  {},
  Methods
>;
