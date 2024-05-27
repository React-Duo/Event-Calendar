import { useContext } from "react"
import GlobalContext from "./calendarContext/GlobalContext"
import dayjs from "dayjs"
import localeData from 'dayjs/plugin/localeData'
dayjs.locale('en-gb')


const CalendarHeader = () => {
  const { monthIndex, setMonthIndex } = useContext(GlobalContext)
  const { weekOffset, setWeekOffset } = useContext(GlobalContext)
  const { view, setView } = useContext(GlobalContext)
  const { dayOffset, setDayOffset } = useContext(GlobalContext)
  dayjs.extend(localeData)

  // week
  const handleNextWeek = () => {
    setWeekOffset(weekOffset + 1)
  }

  const handlePrevWeek = () => {
    setWeekOffset(weekOffset - 1)
  }
  const handleResetWeek = () => {
    setWeekOffset(dayjs().week() - dayjs(new Date(dayjs().year(), monthIndex - 1, 1)).week())
  }
// month
  const handlePrevMonth = () => {
    setMonthIndex(monthIndex - 1)
  }
  const handleNextMonth = () => {
    setMonthIndex(monthIndex + 1)
  }
  const handleReset = () => {
    setMonthIndex(dayjs().month())
  }
// day

  const handleNextDay = () => {
    setDayOffset(dayOffset + 1)
  }
  const handlePrevDay = () => {
    setDayOffset(dayOffset - 1)
  }
  const resetDayOffset = () => {
    setDayOffset(0)
  };

  return (
    <header className="calendar-header">
      <button onClick={() => {
        if (view === "month") {
          handlePrevMonth()
        } else if(view === "week") {
          handlePrevWeek()
        } else if(view === "day") {
          handlePrevDay()
        }
      }}>
        <span >
          <i className="fa-solid fa-chevron-left"></i>
        </span>
      </button>
      <h2>
        {view === "month" && dayjs(new Date(dayjs().year(), monthIndex)).format("MMMM YYYY")}
        {view === "week" && `${dayjs().startOf('week').subtract(1, 'day').add(weekOffset * 7, 'day').format("DD")} - ${dayjs().startOf('week').subtract(1, 'day').add(weekOffset * 7 + 6, 'day').format("DD")}`}        
        {view === "day" && dayjs().add(dayOffset, 'day').format("DD MMMM YYYY")}
        </h2>
      <button onClick={() => {
        if (view === "month") {
          handleNextMonth()
        } else if(view === "week") {
          handleNextWeek()
        } else if(view === "day") {
          handleNextDay()
        }
      }}>
        <span>
          <i className="fa-solid fa-chevron-right"></i>
        </span>
      </button>
      <button onClick={() => {
        if (view === "month") {
          handleReset()
        } else if (view === "week") {
          handleResetWeek()
        } else if (view === "day") {
          resetDayOffset()
        }
      }}>Today</button>
      <button onClick={() => {
        handleReset()
        setView("month")
      }}>Month</button>
      <button onClick={()=> {
         handleReset()
        resetDayOffset()
        setView("day")
      }}>Day</button>
      <button onClick={() => {
        handleReset()
        setView("week")
      }}>Week</button>
      <button>Work week</button>

    </header>
  )
}

export default CalendarHeader