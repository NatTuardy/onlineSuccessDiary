import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import validationConfig from "../utils/validationConfig";
import { validator } from "../utils/validator";
import Title from "./common/typografy/title";
import Subtitle from "./common/typografy/subtitle";
import SmallTitle from "./common/typografy/smallTitle";
import getDate from "../utils/getDate";
import TextField from "./common/form/textField"; // Импортируем TextField
import { DayToEdit, ValidationConfig } from "../types/interfaces";


const FormPage = () => {
  const location = useLocation();
  const dayToEdit =
    (location.state as { dayToEdit?: DayToEdit })?.dayToEdit || {}; // Получаем день для редактирования
  const currentData = getDate(0);
  const navigate = useNavigate();

  const [data, setData] = useState<DayToEdit>(() => {
    // Заполняем обязательные поля успехов 1-5
    const initialData: DayToEdit = {
      dateNow: dayToEdit.dateNow || currentData, // Если редактируем день, то берем дату из dayToEdit, иначе - текущую дату
      successes1: dayToEdit.successes1 || "",
      successes2: dayToEdit.successes2 || "",
      successes3: dayToEdit.successes3 || "",
      successes4: dayToEdit.successes4 || "",
      successes5: dayToEdit.successes5 || "",
    };

    // Добавляем динамические поля дополнительных успехов
    Object.keys(dayToEdit).forEach((key) => {
      if (key.startsWith("additionalSuccess")) {
        initialData[key] = dayToEdit[key];
      }
    });

    return initialData;
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [additionalInputs, setAdditionalInputs] = useState<
    { label: string; value: string }[]
  >([]);
  const [validatorConfig, setValidatorConfig] = useState(validationConfig);
  const [daysDiary, setDaysDiary] = useState<DayToEdit[]>([]);
  const [existAlert, setExistAlert] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [updatedDay, setUpdatedDay] = useState(false);

  useEffect(() => {
    const savedDays: DayToEdit[] = [];
    // Перебираем все ключи в localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key: string | null = localStorage.key(i);

      // Отбираем только те ключи, которые начинаются с 'day' и имеют дату
      if (key && key.startsWith("day") && /\d{8}/.test(key.replace("day", ""))) {
        const savedDay = JSON.parse(
          window.localStorage.getItem(key) || "{}"
        ) as DayToEdit;
        if (savedDay) {
          savedDays.push(savedDay);
        }
      }
    }
    setDaysDiary(savedDays);
  }, []);

  const validate = (formData: DayToEdit) : boolean => {
    const errors: Record<string, string> = validator(formData, validatorConfig);
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const updateValidationConfig = (additionalFieldsCount: number) => {
    const newValidatorConfig: ValidationConfig = { ...validationConfig }; // Базовый конфиг для обязательных полей

    // Добавляем правила для обязательных полей успехов (1-5)
    for (let i = 1; i <= 5; i++) {
      newValidatorConfig[`successes${i}`] = {
        isRequired: {
          message: `Заповніть Успіх ${i}`,
        },
      };
    }

    // Добавляем правила для дополнительных полей успехов
    for (let i = 1; i <= additionalFieldsCount; i++) {
      const fieldName = `additionalSuccess${i}`;
      newValidatorConfig[fieldName] = {
        isRequired: {
          message: `Заповніть це поле`,
        },
      };
    }

    // Обновляем состояние validatorConfig
    setValidatorConfig(newValidatorConfig);
  };

  useEffect(() => {
    // Проверяем, есть ли данные для редактирования
    if (dayToEdit && Object.keys(dayToEdit).length > 0) {
      // Находим все дополнительные успехи
      const additionalSuccesses: string[] = Object.keys(dayToEdit).filter((key) =>
        key.startsWith("additionalSuccess")
      );

      setAdditionalInputs(
        additionalSuccesses.map((success, index) => ({
          label: `Успіх ${index + 6}`,
          value: dayToEdit[success] || "",
        }))
      );
      // Обновляем данные для всех полей (основные и дополнительные успехи)
      const updatedData: DayToEdit = { ...data, ...dayToEdit };
      setData(updatedData);
      // Обновляем валидацию для всех полей, включая дополнительные
      updateValidationConfig(additionalSuccesses.length);
      setUpdatedDay(true);
    }
  }, [dayToEdit]); // Этот useEffect срабатывает при изменении dayToEdit и длины additionalInputs

  const handleChange = ({ name, value } : {name: keyof DayToEdit, value: string}) => {
    // 1. Обновляем состояние данных
    setData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // 2. Отмечаем текущее поле как "тронутое"
    setTouched((prevState) => ({
      ...prevState,
      [name]: true,
    }));

    // 3.   Перезапускаем валидацию для измененного поля
    const updatedErrors = validator(
      { ...data, [name]: value },
      {
        ...validatorConfig,
        [name]: {
          isRequired: {
            message: validationConfig[name]
              ? validationConfig[name].isRequired.message
              : "Заповніть це поле", // Используем сообщение из validationConfig для обязательных полей и кастомное для дополнительных
          },
        },
      }
    );

    // 4. Проверяем только предыдущие обязательные поля
    const fieldOrder: (keyof DayToEdit)[] = [
      "successes1",
      "successes2",
      "successes3",
      "successes4",
      "successes5",
    ];

    const currentFieldIndex = fieldOrder.indexOf(name);

    if (currentFieldIndex > 0) {
      for (let i = 0; i < currentFieldIndex; i++) {
        // Это избыточная проверка, TypeScript уже знает, что field имеет тип keyof DayToEdit
        const field: keyof DayToEdit = fieldOrder[i];
        if (!data[field] && !touched[field]) {
          // Отмечаем как "тронутое" и валидируем только предыдущие поля
          setTouched((prevState) => ({
            ...prevState,
            [field]: true,
          }));
        }
      }
    }

    // 5. Если поле — это дополнительный импут, обновляем валидацию через updateValidationConfig
    if ((name as string).startsWith("additionalSuccess")) {
      const additionalFieldsCount = Object.keys(data).filter((key) =>
        key.startsWith("additionalSuccess")
      ).length;

      updateValidationConfig(additionalFieldsCount); // Обновляем конфигурацию валидации
    }

    // 6. Обновляем состояние ошибок
    setErrors(updatedErrors);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isValid = validate(data);

    // Если форма невалидна, отмечаем все поля как "тронутые"
    if (!isValid) {
      const allTouched: Record<keyof DayToEdit, boolean> = {};
      for (let fieldName in data) {
        allTouched[fieldName as keyof DayToEdit] = true;
      }
      setTouched(allTouched);
      return;
    }

    // Генерируем уникальный ключ на основе текущей даты
    const formattedDate = (data.dateNow as string).replace(/\./g, ""); // Преобразуем дату в формат YYMMDD
    const uniqueDayKey = `day${formattedDate}`;

    // Проверяем, редактируем ли мы существующий день
    const existingDayIndex: number = daysDiary.findIndex(
      (day) => day.dateNow === data.dateNow
    );

    if (existingDayIndex !== -1 && updatedDay) {
      // Если мы редактируем день
      const updatedDays = [...daysDiary];
      updatedDays[existingDayIndex] = data;
      setDaysDiary(updatedDays); // Обновляем состояние списка дней
      window.localStorage.setItem(uniqueDayKey, JSON.stringify(data)); // Обновляем в localStorage
      setUpdatedDay(false);
    } else {
      // Если это новый день
      const findDoubleDay = daysDiary.find(
        (day) => day.dateNow === data.dateNow
      );

      if (findDoubleDay) {
        setExistAlert(true);
        return;
      } else {
        window.localStorage.setItem(uniqueDayKey, JSON.stringify(data));
        setDaysDiary([...daysDiary, data]); // Добавляем новый день в состояние
      }
    }

    navigate("/days"); // Возвращаемся на страницу списка дней
  };

  const allMandatoryFieldsFilled = (): boolean => {
    return (
      !!data.successes1 &&
      !!data.successes2 &&
      !!data.successes3 &&
      !!data.successes4 &&
      !!data.successes5
    );
  };

  const handleAddInput = () => {
    // 1. Проверяем обязательные поля (1-5)
    for (let i = 1; i <= 5; i++) {
      if (!data[`successes${i}`]?.trim()) {
        // Если обязательное поле пустое, показываем ошибку и прерываем создание
        setTouched((prevState) => ({
          ...prevState,
          [`successes${i}`]: true,
        }));
        return; // Прерываем создание нового импута
      }
    }

    // 2. Проверяем все существующие дополнительные импуты
    const allAdditionalFieldsValid = additionalInputs.every((_, index) => {
      const fieldName = `additionalSuccess${index + 1}`;
      return data[fieldName]?.trim(); // Проверяем, заполнено ли поле
    });

    if (!allAdditionalFieldsValid) {
      // Если хотя бы одно поле пустое, показываем ошибку и прерываем создание
      const updatedErrors = additionalInputs.reduce((acc, _, index) => {
        const fieldName = `additionalSuccess${index + 1}`;
        if (!data[fieldName]?.trim()) {
          acc[fieldName] = "Заповніть це поле"; // Устанавливаем ошибку для незаполненного поля
          setTouched((prevState) => ({
            ...prevState,
            [fieldName]: true,
          }));
        }
        return acc;
      }, {});

      setErrors((prevErrors) => ({
        ...prevErrors,
        ...updatedErrors,
      }));

      return; // Прерываем создание нового импута
    }

    // 3. Если нет незаполненных дополнительных импутов — создаем новый
    const newInputIndex = additionalInputs.length + 1;
    const newFieldName = `additionalSuccess${newInputIndex}`;
    const newLabel = `Успіх ${newInputIndex + 5}`;
    console.log("newLabel", newLabel);

    // Обновляем данные формы (новый импут)
    setAdditionalInputs((prevState) => [
      ...prevState,
      { label: newLabel, value: "" },
    ]);

    // Добавляем новое поле в данные формы
    setData((prevState) => ({
      ...prevState,
      [newFieldName]: "",
    }));

    // Используем функцию updateValidationConfig для обновления валидации
    updateValidationConfig(additionalInputs.length + 1); // Передаем обновленное количество полей

    // Устанавливаем, что новое поле не "тронуто"
    setTouched((prevState) => ({
      ...prevState,
      [newFieldName]: false,
    }));
  };

  const handleDeleteAdditionalInput = (indexToDelete) => {
    // 1. Удаляем импут из additionalInputs и пересчитываем лейблы
    const updatedAdditionalInputs = additionalInputs
      .filter((_, index) => index !== indexToDelete)
      .map((input, index) => ({
        ...input,
        label: `Успіх ${index + 6}`, // Обновляем лейблы, начиная с Успіх 6
      }));

    // 2. Обновляем данные формы (data)
    const newData = {};
    Object.keys(data).forEach((key) => {
      if (key.startsWith("additionalSuccess")) {
        const fieldIndex =
          parseInt(key.replace("additionalSuccess", ""), 10) - 1;

        if (fieldIndex !== indexToDelete) {
          const newIndex =
            fieldIndex > indexToDelete ? fieldIndex - 1 : fieldIndex;
          newData[`additionalSuccess${newIndex + 1}`] = data[key]; // Переносим данные в новое поле
        }
      } else {
        newData[key] = data[key]; // Копируем остальные данные
      }
    });

    // 3. Обновляем ошибки для оставшихся полей
    const updatedErrors = {};
    Object.keys(errors).forEach((key) => {
      if (!key.startsWith("additionalSuccess")) {
        updatedErrors[key] = errors[key]; // Копируем ошибки для обязательных полей
      } else {
        const fieldIndex =
          parseInt(key.replace("additionalSuccess", ""), 10) - 1;
        if (fieldIndex !== indexToDelete) {
          const newIndex =
            fieldIndex > indexToDelete ? fieldIndex - 1 : fieldIndex;
          updatedErrors[`additionalSuccess${newIndex + 1}`] = errors[key]; // Переносим ошибки для дополнительных полей
        }
      }
    });

    // 4. Обновляем конфигурацию валидации для оставшихся полей
    updateValidationConfig(updatedAdditionalInputs.length); // Передаем текущее количество оставшихся дополнительных полей

    // 5. Обновляем состояние
    setAdditionalInputs(updatedAdditionalInputs);
    setData(newData);
    setErrors(updatedErrors);
  };

  const handleClose = () => {
    setExistAlert(false);
    navigate("/days");
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-8 offset-md-2 shadow p-4">
          <Title>Мій щоденник успіху!</Title>
          <SmallTitle>{`Сьогодні: ${data.dateNow}`}</SmallTitle>
          <Subtitle>Я молодець, тому що:</Subtitle>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Успіх 1"
              name="successes1"
              value={data.successes1}
              onChange={handleChange}
              error={touched.successes1 ? errors.successes1 : ""}
            />
            <TextField
              label="Успіх 2"
              name="successes2"
              value={data.successes2}
              onChange={handleChange}
              error={touched.successes2 ? errors.successes2 : ""}
            />
            <TextField
              label="Успіх 3"
              name="successes3"
              value={data.successes3}
              onChange={handleChange}
              error={touched.successes3 ? errors.successes3 : ""}
            />
            <TextField
              label="Успіх 4"
              name="successes4"
              value={data.successes4}
              onChange={handleChange}
              error={touched.successes4 ? errors.successes4 : ""}
            />
            <TextField
              label="Успіх 5"
              name="successes5"
              value={data.successes5}
              onChange={handleChange}
              error={touched.successes5 ? errors.successes5 : ""}
            />

            {additionalInputs.map((input, index) => (
              <div className="row align-items-center" key={index}>
                <div className="col-11">
                  <TextField
                    label={input.label}
                    name={`additionalSuccess${index + 1}`}
                    value={data[`additionalSuccess${index + 1}`] || ""}
                    onChange={handleChange}
                    error={
                      touched[`additionalSuccess${index + 1}`]
                        ? errors[`additionalSuccess${index + 1}`]
                        : ""
                    }
                  />
                </div>
                <div className="col-1 d-flex justify-content-center">
                  <i
                    className="bi bi-trash-fill" // Иконка "мусорка"
                    style={{ cursor: "pointer" }} // Настройка стилей для иконки
                    onClick={() => handleDeleteAdditionalInput(index)} // Обработчик удаления
                  ></i>
                </div>
              </div>
            ))}

            {allMandatoryFieldsFilled() && (
              <button
                type="button"
                className="btn btn-outline-primary w-100 my-3"
                onClick={handleAddInput}
              >
                Додати ще один успіх
              </button>
            )}
            <div id="liveAlertPlaceholder">
              {existAlert ? (
                <div
                  className="alert alert-success alert-dismissible"
                  role="alert"
                >
                  <div>За сьогодні твої успіхи заповнені</div>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="alert"
                    aria-label="Close"
                    onClick={handleClose}
                  ></button>
                </div>
              ) : (
                ""
              )}
            </div>

            <button
              type="submit"
              className="btn btn-success w-100 mx-auto"
              disabled={Object.keys(errors).length > 0}
            >
              Підтверджую, що я молодець!
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormPage;
