import { body } from "express-validator";

const registerValidation = [
  body("firstName")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters"),
  body("lastName")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters"),
  body("email").isEmail().withMessage("Incorrect email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

export { registerValidation };
