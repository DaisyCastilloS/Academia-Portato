const roleSchema = require("../models/role.models.js");

module.exports = {
  CreateRoles: async () => {
    try {
      // Count Documents
      const count = await roleSchema.estimatedDocumentCount();

      // check for existing roles
      if (count > 0) return;

      // Create default Roles
      const values = await Promise.all([
        new roleSchema({ name: "User" }).save(),
        new roleSchema({ name: "Admin" }).save(),
      ]);

      console.log(values);
    } catch (error) {
      console.error(error);
    }
  },
};
