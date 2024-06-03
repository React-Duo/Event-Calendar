import GlobalContext from "./GlobalContext"
import { useState } from "react"
import dayjs from "dayjs"
import PropTypes from 'prop-types';
import weekOfYear from 'dayjs/plugin/weekOfYear'
dayjs.extend(weekOfYear);

const ContextWrapper = (props) => {
    const [monthIndex, setMonthIndex] = useState(dayjs().month())
    const [view, setView] = useState("month")
    const [month] = useState(dayjs().month())
    const [weekOffset, setWeekOffset] = useState(dayjs().week() - dayjs(new Date(dayjs().year(), month - 1, 1)).week() + 4) //! change 4 for the next week?
    const [dayOffset, setDayOffset] = useState(0)
    return (
            <GlobalContext.Provider value={{ monthIndex, setMonthIndex, view, setView, weekOffset, setWeekOffset, dayOffset, setDayOffset }}>
                {props.children}
            </GlobalContext.Provider>
    )
}

ContextWrapper.propTypes = {
    children: PropTypes.node
};



export default ContextWrapper