import { validator } from "./validator"; 

export function validateData(data, validatorConfig) {
    const errors = validator(data, validatorConfig);
    return errors;
}