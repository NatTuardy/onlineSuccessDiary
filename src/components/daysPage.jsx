import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Title from "./common/typografy/title";
import getDate from "../utils/getDate";

import CardWrapper from "./common/Card";
const DaysPage = () => {
  const currentData = getDate(0);
  const [daysDiary, setDaysDiary] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const day1 = JSON.parse(window.localStorage.getItem("day 1"));
    const day2 = JSON.parse(window.localStorage.getItem("day 2"));
    const day3 = JSON.parse(window.localStorage.getItem("day 3"));
    const day4 = JSON.parse(window.localStorage.getItem("day 4"));
    const day5 = JSON.parse(window.localStorage.getItem("day 5"));
    const day6 = JSON.parse(window.localStorage.getItem("day 6"));
    if (day1) {
      setDaysDiary([day1]);
    }
    if (day2) {
      setDaysDiary((prevState) => [day2, ...prevState]);
    }
    if (day3) {
      setDaysDiary((prevState) => [day3, ...prevState]);
    }
    if (day4) {
      setDaysDiary((prevState) => [day4, ...prevState]);
    }
    if (day5) {
      setDaysDiary((prevState) => [day5, ...prevState]);
    }
    if (day6) {
      setDaysDiary((prevState) => [day6, ...prevState]);
    }
  }, []);
  const checkCurrentDate = () => {
    const checkedFillDay = daysDiary.find((day) => day.dateNow === currentData);
    return checkedFillDay ? true : false;
  };
  const stringButton = () => {
    return checkCurrentDate()
      ? "Ти молодець! Повернися завтра"
      : "Заповни свої успіхи за сьогодні";
  };
  const handleClickButton = () => {
    navigate("/onlineSuccessDiary/");
  };
  const listDays = daysDiary.map((day, i) => (
    <li className=" mt-3" key={i}>
      <p> Сьогодні: {day.dateNow}</p>
      <p> Я молодець, тому що:</p>
      <div className="containerWrapper mt-1">
        <div className="row">
          <div className="col-md-8 offset-md-2 shadow p-4">
            <p>1. {day.successes1} </p>
            <p>2. {day.successes2} </p>
            <p>3. {day.successes3} </p>
            <p>4. {day.successes4} </p>
            <p>5. {day.successes5} </p>
          </div>
        </div>
      </div>
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
