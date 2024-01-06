const mongoose = require("mongoose");

const nivelesPreciosEnum = {
  Basico: "20",
  Intermedio: "50",
  Avanzado: "90",
};

const instrumentosEnum = [
  "Violin",
  "Violoncello",
  "Contrabajo",
  "Ukelele",
  "Guitarra",
  "Arpa",
];

const toLower = (value) => value.toLowerCase();

const CourseSchema = mongoose.Schema({
  curso: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        return instrumentosEnum.map(toLower).includes(value.toLowerCase());
      },
      message: "El curso no está en nuestra lista de cursos",
    },
  },

  nivel: {
    type: String,
    required: true,
    enum: ["Basico", "Intermedio", "Avanzado"],
  },
  precio: {
    type: String,
    required: true,
    validate: {
      validator: async function (value) {
        // Obtener el nivel actual directamente del documento
        const nivelActual = this.get("nivel");

        // Obtener el precio correspondiente al nivel seleccionado
        const precioEsperado = nivelesPreciosEnum[nivelActual];

        // Comparar el valor ingresado con el precio esperado
        const isValid = value === precioEsperado;

        return isValid;
      },
      message: "El precio no corresponde al nivel seleccionado",
    },
    enum: Object.values(nivelesPreciosEnum),
  },

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
          const isLoggedInUser = this.isLoggedInUser || false;
          if (isLoggedInUser && value !== isLoggedInUser.email) {
            throw new Error(
              "No puedes registrar cursos con un correo diferente al del login"
            );
          }

          // Check if the email exists in the database
          const emailExists = await this.constructor.findOne({
            email: value,
          });

          if (emailExists) {
            throw new Error(
              "Ya tomaste un curso con este correo, sólo puedes tomar un curso por correo"
            );
          }

          return true;
        },
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
});

CourseSchema.pre("validate", function (next) {
  if (this.nivel && !this.precio) {
    // Obtener el nivel actual directamente del documento
    const nivelActual = this.get("nivel");
    this.precio = nivelesPreciosEnum[nivelActual];
  }
  next();
});

module.exports = mongoose.model("course", CourseSchema);
