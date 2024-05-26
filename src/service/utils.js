import dayjs from "dayjs";

export function getMonth(month = dayjs().month()) {
    const year = dayjs().year();
    const firstDayOfTheMonth = dayjs(new Date(year, month, 1)).day();
    let currentMonthCount = 1 - firstDayOfTheMonth;

    const daysMatrix = new Array(5).fill([]).map(()=> {
       return new Array(7).fill(null).map(()=> {
            currentMonthCount++;
            return dayjs(new Date(year, month, currentMonthCount));
        })
    })
    return daysMatrix;
}

export function getWeekDays(month = dayjs().month()) {
    const year = dayjs().year();
    const firstDayOfTheMonth = dayjs(new Date(year, month, 1)).day();
    let currentMonthCount = 1 - firstDayOfTheMonth;

    const daysMatrix = new Array(5).fill([]).map(()=> {
       return new Array(23).fill(null).map(()=> {
            currentMonthCount++;
            return dayjs(new Date(year, month, currentMonthCount, currentMonthCount));
        })
    })
    return daysMatrix;
}

export function getMonthDays(date) {
    const month = new Date(date).getMonth() + 1;
    const year = new Date(date).getFullYear();
    
    const days = {
        1: 31,
        2: year % 4 === 0 ? 29 : 28,
        3: 31,
        4: 30,
        5: 31,
        6: 30,
        7: 31,
        8: 31,
        9: 30,
        10: 31,
        11: 30,
        12: 31
    }

    return days[month];
}

export function getWeekDay(dayAsNumber) {
    const weekDays = {
        0: "Sunday",
        1: "Monday",
        2: "Tuesday",
        3: "Wednesday",
        4: "Thursday",
        5: "Friday",
        6: "Saturday"
    }
    return weekDays[dayAsNumber];
}