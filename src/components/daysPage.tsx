import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Title from "./common/typografy/title";
import getDate from "../utils/getDate";
import CardWrapper from "./common/Card";
import CollapseWrapper from "./common/collapse";

const DaysPage = () => {
  const currentData = getDate(0);
  const [daysDiary, setDaysDiary] = useState([]);
  const [alertInfo, setAlertInfo] = useState(false); // Состояние для показа алерта
  const navigate = useNavigate();

  useEffect(() => {
    const savedDays = [];

    // Перебираем все ключи в localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);

      // Отбираем только те ключи, которые начинаются с 'day'
      if (key.startsWith("day")) {
        const savedDay = JSON.parse(window.localStorage.getItem(key));
        if (savedDay) {
          savedDays.push(savedDay);
        }
      }
    }

   // Сортируем дни в обратном порядке (по дате, от самого нового к старому)
   const sortedDays = savedDays.sort((a, b) => {
    const dateA = new Date(a.dateNow.split('.').reverse().join('-')); // Преобразуем дату в формат ISO для корректной сортировки
    const dateB = new Date(b.dateNow.split('.').reverse().join('-'));
    return dateB  - dateA   ; // Сортируем по убыванию даты
  });

  // Устанавливаем отсортированные дни в состояние
  if (sortedDays.length > 0) {
    console.log("sortedDays", sortedDays);
    setDaysDiary(sortedDays);
  }
  }, []);

  const checkCurrentDate = () => {
    const checkedFillDay = daysDiary.find((day) => day.dateNow === currentData);
    return !!checkedFillDay; // Проверяем, был ли заполнен день для текущей даты
  };

  const stringButton = () => {
    return checkCurrentDate()
      ? "Ти молодець! Повернися завтра"
      : "Заповни свої успіхи за сьогодні";
  };

  const handleClickButton = () => {
    navigate("/");
  };

  // Функция для удаления дня
  const handleDelete = (date) => {
    // Найти ключ в localStorage, соответствующий указанной дате
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const savedDay = JSON.parse(localStorage.getItem(key));

      // Проверяем, совпадает ли дата в сохраненных данных с удаляемой датой
      if (savedDay.dateNow === date) {
        localStorage.removeItem(key); // Удаляем ключ из localStorage
        break;
      }
    }

    // Обновляем состояние, удаляя день из daysDiary
    const updatedDays = daysDiary.filter((day) => day.dateNow !== date);
    setDaysDiary(updatedDays); // Обновляем состояние компонента
    setAlertInfo(false);
  };

  // Функция для редактирования
  const handleEdit = (dateNow) => {
    const dayToEdit = daysDiary.find((day) => day.dateNow === dateNow); // Находим день по дате
    navigate("/", { state: { dayToEdit } }); // Передаем день на страницу редактирования
  };

  // Открытие алерта для подтверждения удаления
  const openDeleteAlert = (day) => {
    console.log("openDeleteAlert")
    setAlertInfo(day); // Сохраняем информацию о дне, который хотим удалить
  };

  

  // Закрытие алерта
  const handleCloseAlert = () => {
    setAlertInfo(false);
  };

  const listDays = [...daysDiary] // Копируем массив, чтобы не мутировать оригинальный
    .map((day, i) => (
      <li className="mt-3 position-relative" key={i}>
        <CollapseWrapper
          title={`Сьогодні: ${day.dateNow} - Я молодець, тому що:`}
          name={`day${i}`}
        >
          {/* Контейнер для успехов */}
          <div className="containerWrapper mt-1 position-relative">
            {/* Алерт удаления, который будет накладываться поверх */}
            {alertInfo && alertInfo.dateNow === day.dateNow && (
              <div className="alert alert-warning alert-dismissible fade show position-absolute w-100" 
                   role="alert" 
                   style={{ top: '0', left: '0', zIndex: '10'}}>
                <div>Ви дійсно хочете видалити цей запис або відредагувати його?</div>
                <div className="d-flex justify-content-between mt-2">
                  <button
                    type="button"
                    className="btn btn-danger mx-2"
                    onClick={() => handleDelete(alertInfo.dateNow)}
                  >
                    Видалити
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary mx-2"
                    onClick={() => handleEdit(alertInfo.dateNow)}
                  >
                    Редагувати
                  </button>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleCloseAlert}
                  ></button>
                </div>
              </div>
            )}

            <div className="row">
              <div className="col-md-10 mx-auto offset-md-2 shadow p-4">
                <div className="d-flex justify-content-between">
                  <div>
                    {Object.keys(day).map((key, idx) => {
                      if (key.startsWith("successes") && day[key]) {
                        return (
                          <p key={idx}>
                            {idx }. {day[key]}
                          </p>
                        );
                      }
                      if (key.startsWith("additionalSuccess") && day[key]) {
                        return (
                          <p key={idx}>
                            {idx }. {day[key]}
                          </p>
                        );
                      }
                      return null;
                    })}
                  </div>
                  <div className="icons">
                    {/* Иконка редактирования */}
                    <i
                      className="bi bi-pencil-fill mx-2"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleEdit(day.dateNow)}
                    ></i>
                    {/* Иконка удаления */}
                    <i
                      className="bi bi-trash-fill"
                      style={{ cursor: "pointer" }}
                      onClick={() => openDeleteAlert(day)}
                    ></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CollapseWrapper>
      </li>
    ));


  return (
    <CardWrapper>
      <Title>Мій щоденник УСПІХУ:</Title>
      <button
        type="button"
        className="btn btn-success w-100 mx-auto"
        onClick={handleClickButton}
        disabled={checkCurrentDate()}
      >
        {stringButton()}
      </button>
      <ul>{listDays}</ul>
    </CardWrapper>
  );
};

export default DaysPage;
