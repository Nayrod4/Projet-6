const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');

const sanitizerPlugin = require('mongoose-sanitizer-plugin');

const userSchema = mongoose.Schema({
  email: { type: String, required: [true, "Veuillez entrer votre adresse email"], unique: true, match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, "Veuillez entrer une adresse email correcte"] },
  password: { type: String, required: [true, "Veuillez choisir un mot de passe"] },
});

/// Valeur Unique
userSchema.plugin(uniqueValidator);
/// Désinfection les champs du modèle avant save dans la DB
userSchema.plugin(sanitizerPlugin);
/// Le modèle s'appellera user et on lui passe le shéma de données
module.exports = mongoose.model('User', userSchema);