const mongoose = require("mongoose");

const bcrypt = require("bcrypt");

const UserSchema = mongoose.Schema({
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
            .model("user")
            .findOne({ email: value });
          return !emailExists;
        },
        message: "Este correo electrónico ya está registrado",
      },
      {
        validator: function (value) {
          // Validación de formato de correo electrónico
          return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
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
});

UserSchema.pre("validate", async function (next) {
  try {
    // Verifica si el email existe
    if (this.email && !this.emailExists) {
      // Hash the password before saving it
      // const salt = await bcrypt.genSalt();
      // const hashedPassword = await bcrypt.hash(this.password, salt);
      // this.password = hashedPassword;
      // console.log(salt);
      // console.log(hashedPassword);
      // // Guardar el usuario solo si el email no existe, en el conrolador ya se guarda el usuario, asi que por eso lo oculto aca
      // const savedUser = await this.save();
      // console.log(savedUser);
    }
    next();
  } catch (error) {
    next(error);
  }
});
module.exports = mongoose.model("user", UserSchema);
