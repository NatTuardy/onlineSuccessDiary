import React, { useState } from "react";
import PropTypes from "prop-types";

const TextField = ({ label, type, name, value, onChange, error, ...rest }) => {
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = ({ target }) => {
        onChange({ name: target.name, value: target.value });
    };
    const getInputClasses = () => {
        return "form-control" + (error ? " is-invalid" : "");
    };
    const toggleShowPassword = () => {
        setShowPassword((prevState) => !prevState);
    };
    return (
        <div className="mb-4">
            <label htmlFor={name}> {label}</label>
            <div className="input-group has-validation">
            {type === "textarea" ? (
                    <textarea
                        id={name}
                        name={name}
                        value={value}
                        onChange={handleChange}
                        className={getInputClasses()}
                        rows="3"  // Задаем количество строк для textarea (можно изменить)
                        {...rest}
                    />
                ) : (
                    <input
                        type={showPassword && type === "password" ? "text" : type}
                        id={name}
                        name={name}
                        value={value}
                        onChange={handleChange}
                        className={getInputClasses()}
                        {...rest}
                    />
                )}

                {type === "password" && (
                    <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={toggleShowPassword}
                    >
                        <i
                            className={
                                "bi bi-eye" + (showPassword ? "-slash" : "")
                            }
                        ></i>
                    </button>
                )}
                {error && <div className="invalid-feedback ">{error}</div>}
            </div>
        </div>
    );
};
TextField.defaultProps = {
    type: "textarea"
};
TextField.propTypes = {
    label: PropTypes.string,
    type: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    error: PropTypes.string
};

export default React.memo(TextField);
