import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Veuillez entrer votre nom'],
    },
    email: {
      type: String,
      required: [true, 'Veuillez entrer votre email'],
      unique: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, 'Veuillez entrer un email valide'],
    },
    password: {
      type: String,
      required: [true, 'Veuillez entrer un mot de passe'],
      minlength: 6,
      select: false,
    },
    phone: {
      type: String,
      required: [true, 'Veuillez entrer votre numéro de téléphone'],
      match: [/^(?:\+212|0)([5-7]\d{8})$/, 'Veuillez entrer un numéro marocain valide (+212XXXXXXXXX)'],
    },
    role: {
      type: String,
      enum: ['driver', 'owner', 'admin'],
      default: 'driver',
    },
    avatar: {
      type: String,
      default: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
