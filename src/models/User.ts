import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

export enum Genders {
  man = 'man',
  woman = 'woman',
}
export interface IUser extends mongoose.Document {
  email: string,
  password: string,
  height?: number,
  weight?: number,
  weightGoal?: number,
  age?: number,
  gender: Genders,
  calorieWidget: {
    limit: number,
    eaten: number,
  },
  token?: string,
  createdAt: Date,
  updatedAt: Date,
  comparePassword(password: string): Promise<boolean>,
  existUser(email: string): Promise<boolean>;
}

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  height: {
    type: Number,
  },
  weight: {
    type: Number,
  },
  weightGoal: {
    type: Number,
  },
  age: {
    type: Number,
  },
  gender: {
    type: String,
  },
  calorieWidget: {
    type: Object,
    limit: {
      type: Number,
      required: true,
    },
    eaten: {
      type: String,
      required: true,
    },
  }
}, {
  timestamps: true
});

UserSchema.pre("save", async function (next) {
  const user = this as IUser;

  if (!user.isModified("password")) {
    return next();
  }

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(user.password, salt);

  user.password = hash;

  return next();
})

UserSchema.methods.existUser = async function (email: string) {
  const user = this as IUser;
  return bcrypt.compareSync(email, user.email);
}

UserSchema.methods.comparePassword = async function (password: string) {
  const user = this as IUser;
  return bcrypt.compareSync(password, user.password);
}

const User = mongoose.model<IUser>("User", UserSchema);

export default User;