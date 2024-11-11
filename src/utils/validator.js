export function validator(data, validatorConfig) {
    const errors = {};
    function validate(validateMethod, data, config) {
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
                statusValidate = !emailRegExp.test(data);
                break;
            }
            case "isCapitalSymbol": {
                const capitalRegExp = /[A-Z]+/g;
                statusValidate = !capitalRegExp.test(data);
                break;
            }
            case "isContainDigit": {
                const digitRegExp = /\d+/g;
                statusValidate = !digitRegExp.test(data);
                break;
            }
            case "min": {
                statusValidate = data.length < config.value;
                break;
            }
            default:
                break;
        }
        if (statusValidate) return config.message;
    }

    // Проверяем как по данным, так и по конфигу валидации
    for (const fieldName in validatorConfig) {
        const fieldValue = data[fieldName] || "";  // Если поле отсутствует в data, считаем его пустым
        const config = validatorConfig[fieldName];

        for (const validateMethod in config) {
            const error = validate(validateMethod, fieldValue, config[validateMethod]);
            if (error) {
                errors[fieldName] = error;
            }
        }
    }

    return errors;
}
