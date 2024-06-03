import dayjs from "dayjs";
import weekOfYear from 'dayjs/plugin/weekOfYear'
dayjs.extend(weekOfYear);
import { STREET_MIN_CHARS, STREET_MAX_CHARS, STREET_REGEX, 
        COUNTRY_MIN_CHARS, COUNTRY_MAX_CHARS, COUNTRY_REGEX,
        CITY_MIN_CHARS, CITY_MAX_CHARS, CITY_REGEX } from '../common/constants.js';

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

export function getWeek(month, weekOffset) {
    const year = dayjs().year();
    const firstDayOfWeek = dayjs().startOf('week').date();
    let currentDayCount = firstDayOfWeek + (weekOffset * 7);
    const daysMatrix = new Array(7).fill([]).map(() => {
        currentDayCount++;
        return new Array(24).fill(null).map((_, hour) => {
            return dayjs(new Date(year, month - 2, currentDayCount - 2, hour));
        });
    });
    return daysMatrix;
}
export function getDay(dayOffset = 0) {
    const year = dayjs().year();
    const month = dayjs().month();
    const currentDay = dayjs().add(dayOffset, 'day').date();
    const dayMatrix = new Array(24).fill(null).map((_, hour) => {
        return dayjs(new Date(year, month, currentDay, hour));
    });
    return dayMatrix;
}

export function getWorkWeek(month = dayjs().month(), weekOffset = dayjs().week() - dayjs(new Date(dayjs().year(), month - 1, 1)).week() + 1) {
    const year = dayjs().year();
    const firstDayOfWeek = dayjs().startOf('week').date();
    let currentDayCount = firstDayOfWeek + (weekOffset * 7);
    const daysMatrix = new Array(5).fill([]).map(() => {
        currentDayCount++;
        return new Array(24).fill(null).map((_, hour) => {
            return dayjs(new Date(year, month - 2, currentDayCount - 2, hour));
        });
    });
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

export function isAddressValid (location, setError) {
    if (!COUNTRY_REGEX.test(location.country)) {  
        setError(`Country must contain ${COUNTRY_MIN_CHARS}-${COUNTRY_MAX_CHARS} characters, uppercase/lowercase letters and space only.`);
        return 'Address is invalid';
    }

    if (!CITY_REGEX.test(location.city)) {
        setError(`City must contain ${CITY_MIN_CHARS}-${CITY_MAX_CHARS} characters, uppercase/lowercase letters and space only.`);
        return 'Address is invalid';
    }

    if (!STREET_REGEX.test(location.street)) {
        setError(`Street must contain ${STREET_MIN_CHARS}-${STREET_MAX_CHARS} characters, uppercase/lowercase letters, digits and space/dot.`);
        return 'Address is invalid';
    }
}