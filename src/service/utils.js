import dayjs from "dayjs";
import weekOfYear from 'dayjs/plugin/weekOfYear'
dayjs.extend(weekOfYear);

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

export function getWeek(month = dayjs().month(), weekOffset = dayjs().week() - dayjs(new Date(dayjs().year(), month - 1, 1)).week()) {

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
