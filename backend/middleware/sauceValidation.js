const validate = require('mongoose-validator');

exports.nameValidator = [
  validate({
    validator: 'isLength',
    arguments: [3, 30],
    message: 'Le nom de votre Sauce doit contenir entre 3 and 30 caractères',
  }),
  validate({
    validator: 'matches',
    arguments: /^[a-z\d\-_\s]+$/i,
    message: "Vous ne pouvez utiliser que des chiffres et des lettres pour nommer votre sauce",
  }),
];

exports.manufacturerValidator = [
  validate({
    validator: 'isLength',
    arguments: [3, 40],
    message: 'Le nom du fabricant doit contenir entre 3 et 40 caractères',
  }),
  validate({
    validator: 'matches',
    arguments: /^[a-z\d\-_\s]+$/i,
    message: "Vous ne pouvez utiliser que des chiffres et des lettres pour nommer le fabricant",
  }),
];

exports.descriptionValidator = [
  validate({
    validator: 'isLength',
    arguments: [10, 300],
    message: 'La description de la sauce doit contenir entre 10 et 300 caractères',
  }),
  validate({
    validator: 'matches',
    arguments: /^[a-z\d\-_\s]+$/i,
    message: "Vous ne pouvez utiliser que des chiffres et des lettres pour la description de la sauce",
  }),
];

exports.pepperValidator = [
  validate({
    validator: 'isLength',
    arguments: [3, 50],
    message: 'Le principal ingrédient doit contenir entre 3 et 50 caractères',
  }),
  validate({
    validator: 'isAlphanumeric',
    message: "Ne peut contenir que des caractères alphanumériques entre 3 et 20 caractères",
  }),
];