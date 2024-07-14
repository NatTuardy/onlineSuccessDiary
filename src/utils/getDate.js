const getDate = (i) => {
    const now = new Date(new Date().setDate(new Date().getDate() +i ));
    const weekDay = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    const day = weekDay[now.getDay()];
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = String(now.getFullYear()).padStart(2, '0');
    const dataToday = String(now.getDate()).padStart(2, '0');
    const currentDate = `${dataToday}.${month}.${year}`;
    return currentDate;
}
 
export default getDate;