import { z } from "zod";

// Define Zod Schema
const userSchema = z.object({
  name: z.string(),
});

// Define Mongoose Schema
const userMongooseSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: Number,
});

const UserModel = mongoose.model("User", userMongooseSchema);

// Using Zod with Mongoose
const createAndSaveUser = async (data: any) => {
  const parsedData = userSchema.safeParse(data);

  if (!parsedData.success) {
    // Handle validation errors
    return;
  }

  const user = new UserModel(parsedData.data);
  await user.save();
};
