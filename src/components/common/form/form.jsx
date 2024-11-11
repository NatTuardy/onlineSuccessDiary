import React, { useState, useEffect, useCallback } from "react";
import { validateData } from "../../../utils/validation"; 
import PropTypes from "prop-types";
const FormComponent = ({
    children,
    validatorConfig,
    onSubmit,
    defaultData,
    externalErrors,
    setExternalErrors
}) => {
    const [errors, setErrors] = useState(externalErrors || {});
    const [data, setData] = useState(defaultData || {});
    const [touched, setTouched] = useState({});

      // Обновление ошибок при изменении externalErrors
      useEffect(() => {
        if (externalErrors) {
            setErrors(externalErrors);
        }
        console.log("externalErrors", externalErrors)
    }, [externalErrors]);
    
    const handleChange = useCallback((target) => {
        console.log("data handleChange:", data);
        setTouched((prevState) => ({
            ...prevState,
            [target.name]: true  // Отмечаем поле как "тронутое"
        }));
        setData((prevState) => ({
            ...prevState,
            [target.name]: target.value
        }));
           // Принудительно валидируем после изменения данных
    const updatedErrors = validateData(
        { ...data, [target.name]: target.value },
        validatorConfig
    );
    setErrors(updatedErrors);
    }, [data, validatorConfig]);
    // const validate = useCallback(
    //     (data) => {
    //         const errors = validator(data, validatorConfig);
    //         console.log("Errors:", errors); // Выводим ошибки для отладки
    //         console.log("validatorConfig:", validatorConfig); // Выводим ошибки для отладки
    //         setErrors(errors);
    //         return Object.keys(errors).length === 0;
    //     },
    //     [validatorConfig, setErrors]
    // );

    const validate = useCallback((data) => {
        const errors = validateData(data, validatorConfig);
        console.log("Errors:", errors); 
        setErrors(errors);
        setExternalErrors(errors)
        return Object.keys(errors).length === 0;
    }, [validatorConfig]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const isValid = validate(data);
        console.log("isValid:", isValid);
        console.log("data:", data);
        const updatedErrors = validateData(data, validatorConfig);
        setErrors(updatedErrors);
        if (!isValid) return;
        onSubmit(data);
    };
    useEffect(() => {
        // console.log("Current data форм:", data);  // Проверяем текущее состояние data
        if (Object.keys(data).length > 0) {
            validate(data);
        }
    }, [data]);
    const handleKeyDown = useCallback((event) => {
        if (event.keyCode === 13) {
            event.preventDefault();
            const form = event.target.form;
            const indexForm = Array.prototype.indexOf.call(form, event.target);
            form.elements[indexForm + 1].focus();
        }
    }, []);
    const isValid = Object.keys(errors).length === 0;

    const clonedElements = React.Children.map(children, (child) => {
        if (!child) {
            return null;
        }
        const childType = typeof child.type;
        let config = {};

        if (childType === "object") {
            if (!child.props.name) {
                throw new Error(
                    "Name property required for field components",
                    child
                );
            }
            config = {
                ...child.props,
                onChange: handleChange,
                value: data[child.props.name] || "",
                error: touched[child.props.name] ? errors[child.props.name] : "",  // Показываем ошибку только если поле было изменено
                onKeyDown: handleKeyDown
            };
        }
        if (childType === "string") {
            if (child.type === "button") {
                if (
                    child.props.type === "submit" ||
                    child.props.type === undefined
                ) {
                    config = { ...child.props, disabled: !isValid };
                }
            }
        }

        return React.cloneElement(child, config);
    });
    return <form onSubmit={handleSubmit}>{clonedElements}</form>;
};
FormComponent.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]),
    validatorConfig: PropTypes.object,
    onSubmit: PropTypes.func,
    defaultData: PropTypes.object
};

export default FormComponent;
