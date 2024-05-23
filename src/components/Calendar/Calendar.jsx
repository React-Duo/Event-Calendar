import "./Calendar.css"
import React from "react";
import { useState, useContext, useEffect } from "react";
import { getMonth } from "../../service/utils";
import CalendarHeader from "./CalendarHeader";
import Month from "./Month";
import GlobalContext from "./calendarContext/GlobalContext";



const Calendar = () => {
    const [currentMonth, setCurrentMonth] = useState(getMonth())
    const { monthIndex } = useContext(GlobalContext)
    useEffect(() => {
        setCurrentMonth(getMonth(monthIndex));
    }, [monthIndex])

    return (
        <React.Fragment>
                <div className="calendar-container">
                    <CalendarHeader />
                    <div className="calendar-month-container">
                        <Month month={currentMonth} />
                    </div>
                </div>
        </React.Fragment>
    );
}

export default Calendar;