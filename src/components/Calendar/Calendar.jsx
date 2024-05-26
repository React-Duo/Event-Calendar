import "./Calendar.css"
import React from "react";
import { useState, useContext, useEffect } from "react";
import { getMonth, getWeek } from "../../service/utils";
import CalendarHeader from "./CalendarHeader";
import Month from "./Month";
import GlobalContext from "./calendarContext/GlobalContext";


const Calendar = () => {
    const [currentMonth, setCurrentMonth] = useState(getMonth())
    const { monthIndex } = useContext(GlobalContext)
    const { view } = useContext(GlobalContext);
    const { weekOffset } = useContext(GlobalContext);


    useEffect(() => {
        if(view === "month"){
            setCurrentMonth(getMonth(monthIndex));
        }else{
            setCurrentMonth(getWeek(monthIndex, weekOffset));
        }
    }, [monthIndex, view, weekOffset])

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