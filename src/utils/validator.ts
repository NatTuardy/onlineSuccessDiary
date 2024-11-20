import { DayToEdit, ValidationConfig } from "../types/interfaces";

export function validator(data: DayToEdit, validatorConfig: ValidationConfig) {
  const errors: Record<string, string> = {};
  function validate(
    validateMethod: string,
    data: string | boolean,
    config: { message: string; value?: number }
  ) {
    let statusValidate;
    switch (validateMethod) {
      case "isRequired": {
        if (typeof data === "boolean") {
          statusValidate = !data;
        } else {
          statusValidate = data.trim() === "";
        }
        break;
      }
      case "isEmail": {
        const emailRegExp = /^\S+@\S+\.\S+$/g;
        statusValidate = !emailRegExp.test(data as string);
        break;
      }
      case "isCapitalSymbol": {
        const capitalRegExp = /[A-Z]+/g;
        statusValidate = !capitalRegExp.test(data as string);
        break;
      }
      case "isContainDigit": {
        const digitRegExp = /\d+/g;
        statusValidate = !digitRegExp.test(data as string);
        break;
      }
      case "min": {
        statusValidate = (data as string).length < config.value!;
        break;
      }
      default:
        break;
    }
    if (statusValidate) return config.message;
  }

  // Проверяем как по данным, так и по конфигу валидации
  for (const fieldName in validatorConfig) {
    const fieldValue = data[fieldName] || ""; // Если поле отсутствует в data, считаем его пустым
    const config = validatorConfig[fieldName];

    for (const validateMethod in config) {
      // Проверяем, существует ли метод валидации в конфигурации
      if (config[validateMethod]) {
        const error = validate(
          validateMethod,
          fieldValue,
          config[validateMethod]
        );
        if (error) {
          errors[fieldName] = error;
        }
      }
    }
  }

  return errors;
}
