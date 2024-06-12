import dayjs from "dayjs";
import weekOfYear from 'dayjs/plugin/weekOfYear'
dayjs.extend(weekOfYear);
import { STREET_MIN_CHARS, STREET_MAX_CHARS, STREET_REGEX, 
        COUNTRY_MIN_CHARS, COUNTRY_MAX_CHARS, COUNTRY_REGEX,
        CITY_MIN_CHARS, CITY_MAX_CHARS, CITY_REGEX } from '../common/constants.js';

/**
 * Returns a matrix representing the days of a month.
 * Each element in the matrix is a dayjs object representing a specific date.
 * By default, it returns the matrix for the current month.
 * @param {number} month - The month index (0-11) for which to generate the matrix. Defaults to the current month.
 * @returns {Array<Array<dayjs>>} - The matrix representing the days of the specified month.
 */
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

/**
 * Returns a matrix of days for a given month and week offset.
 *
 * @param {number} month - The month (1-12) for which to generate the days matrix.
 * @param {number} weekOffset - The offset (0 or positive integer) to determine the week.
 * @returns {Array<Array<dayjs>>} - A matrix of days, where each element is a Dayjs object representing a specific date and time.
 */
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

/**
 * Returns an array of dayjs objects representing each hour of a specific day.
 * By default, it returns the current day.
 * @param {number} dayOffset - The number of days to offset from the current day. Default is 0.
 * @returns {Array<dayjs>} - An array of dayjs objects representing each hour of the specified day.
 */
export function getDay(dayOffset = 0) {
    const year = dayjs().year();
    const month = dayjs().month();
    const currentDay = dayjs().add(dayOffset, 'day').date();
    const dayMatrix = new Array(24).fill(null).map((_, hour) => {
        return dayjs(new Date(year, month, currentDay, hour));
    });
    return dayMatrix;
}

/**
 * Returns a matrix of dayjs objects representing the work week for a given month and week offset.
 * If no arguments are provided, the current month and week offset are used.
 *
 * @param {number} [month=dayjs().month()] - The month (0-11) for which to generate the work week.
 * @param {number} [weekOffset=dayjs().week() - dayjs(new Date(dayjs().year(), month - 1, 1)).week() + 1] - The week offset from the start of the month.
 * @returns {Array<Array<dayjs>>} - A matrix of dayjs objects representing the work week.
 */
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

/**
 * Returns the number of days in a given month.
 * @param {Date} date - The date object representing the month.
 * @returns {number} - The number of days in the month.
 */
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

/**
 * Returns the name of the week day based on the given day number.
 *
 * @param {number} dayAsNumber - The day number (0-6) representing the week day.
 * @returns {string} The name of the week day.
 */
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

/**
 * Checks if the address is valid based on specific regex patterns.
 * @param {Object} location - The location object containing the address details.
 * @param {Function} setError - The function to set an error message.
 * @returns {string|undefined} - Returns 'Address is invalid' if the address is invalid, otherwise undefined.
 */
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