import "./Calendar.css"
import React from "react";
import { useState, useContext, useEffect } from "react";
import { getMonth, getWeek, getDay, getWorkWeek } from "../../service/utils";
import CalendarHeader from "./CalendarHeader";
import Month from "./Month";
import GlobalContext from "./calendarContext/GlobalContext";


const Calendar = () => {
    const [currentMonth, setCurrentMonth] = useState(getMonth())
    const { monthIndex } = useContext(GlobalContext)
    const { view } = useContext(GlobalContext);
    const { weekOffset } = useContext(GlobalContext);
    const { dayOffset } = useContext(GlobalContext);
    const [currentDay, setCurrentDay] = useState(getDay());

    useEffect(() => {
        if(view === "month"){
            setCurrentMonth(getMonth(monthIndex));
        }else if(view === "week"){
            setCurrentMonth(getWeek(monthIndex, weekOffset));
        }else if(view === "day"){
            setCurrentDay(getDay(dayOffset));
        }else if(view === "workWeek"){
            console.log(getWorkWeek(monthIndex, weekOffset));
            setCurrentMonth(getWorkWeek(monthIndex, weekOffset));
        }
    }, [monthIndex, view, weekOffset, dayOffset])

    return (
        <React.Fragment>
                <div className="calendar-container">
                    <CalendarHeader />
                    <div className="calendar-month-container">
                        <Month month={currentMonth} day={currentDay} />
                    </div>
                </div>
        </React.Fragment>
    );
}

export default Calendar;