const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
    },
    apellido: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      minlength: [5, "El correo electrónico debe tener al menos 5 caracteres"],
      validate: [
        {
          validator: async function (value) {
            const emailExists = await mongoose
              .model("User")
              .findOne({ email: value });
            return !emailExists;
          },
          message: "Este correo electrónico ya está registrado",
        },
        {
          validator: function (value) {
            // Validación de formato de correo electrónico
            return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
              value
            );
          },
          message: "Formato de correo electrónico no válido",
        },
      ],
    },
    password: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          // Requiere al menos 7 caracteres con al menos una letra mayúscula y un número
          return /^(?=.*[A-Z])(?=.*\d).{7,}$/.test(value);
        },
        message: (props) =>
          `${props.value} no cumple con los requisitos de seguridad.`,
      },
    },
    roles: [
      {
        ref: "Role",
        type: Schema.Types.ObjectId,
      },
    ],
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
    setDefaultsOnInsert: true,
  }
);
// Pre-validate hook for custom validation
UserSchema.pre("validate", async function (next) {
  try {
    // Check if the password is modified or it's a new user
    if (this.isModified("password") || this.isNew) {
      const originalPassword = this.password;

      // Encrypt the original password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(originalPassword, salt);

      // Set the hashed password to the model
      this.password = hashedPassword;

      // Compare the original password with the hashed password
      const isPasswordMatch = await bcrypt.compare(
        originalPassword,
        this.password
      );

      if (!isPasswordMatch) {
        throw new Error("Password encryption and comparison failed.");
      }
    }

    next();
  } catch (error) {
    next(error);
  }
});

// Pre-save hook to encrypt the password
UserSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password") || this.isNew) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(this.password, salt);
      this.password = hashedPassword;
    }
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("User", UserSchema);
