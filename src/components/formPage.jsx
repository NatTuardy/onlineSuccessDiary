import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FormComponent, { TextField } from "../components/common/form";
import Title from "./common/typografy/title";
import Subtitle from "./common/typografy/subtitle";
import SmallTitle from "./common/typografy/smallTitle";
import getDate from "../utils/getDate";

const FormPage = () => {
  const currentData = getDate(0);
  const navigate = useNavigate();
  const [data] = useState({
    dateNow: currentData,
    successes1: "",
    successes2: "",
    successes3: "",
    successes4: "",
    successes5: "",
  });

  const [daysDiary, setDaysDiary] = useState([]);
  const [existAlert, setExistAlert] = useState(false);

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

  const handleClose = () => {
    setExistAlert(false);
    navigate("/onlineSuccessDiary/days");
  };

  const handleSubmit = (data) => {
    const numberOfDays = daysDiary.length;
    const findDoubleDay = daysDiary.find((day) => day.dateNow === data.dateNow);
    if (findDoubleDay) {
      setExistAlert(true);
      return;
    } else {
      if (numberOfDays <= 5) {
        window.localStorage.setItem(
          `day ${numberOfDays + 1}`,
          JSON.stringify(data)
        );
      }
      navigate("/onlineSuccessDiary/days");
    }
  };


  const validatorConfig = {
    successes1: {
      isRequired: {
        message: "Напишить усі 5 успіхів",
      },
    },

    successes2: {
      isRequired: {
        message: "Напишить усі 5 успіхів",
      },
    },
    successes3: {
      isRequired: {
        message: "Напишить усі 5 успіхів",
      },
    },
    successes4: {
      isRequired: {
        message: "Напишить усі 5 успіхів",
      },
    },
    successes5: {
      isRequired: {
        message: "Напишить усі 5 успіхів",
      },
    },
  };
  return (
    <div className="container mt-5 container">
      <div className="row">
        <div className="col-md-8 offset-md-2 shadow p-4">
          <Title>Мій щоденник успіху!</Title>
          <SmallTitle>{`Сьогодні: ${data.dateNow}`}</SmallTitle>
          <Subtitle>Я молодець, тому що:</Subtitle>
          <FormComponent
            onSubmit={handleSubmit}
            validatorConfig={validatorConfig}
            defaultData={data}
          >
            <TextField label="Успіх 1" name="successes1" autoFocus />
            <TextField label="Успіх 2" name="successes2" />
            <TextField label="Успіх 3" name="successes3" />
            <TextField label="Успіх 4" name="successes4" />
            <TextField label="Успіх 5" name="successes5" />
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
            <button type="submit" className="btn btn-success w-100 mx-auto">
              Підтверджую, що я молодець!
            </button>
          </FormComponent>
        </div>
      </div>
    </div>
  );
};

export default FormPage;
