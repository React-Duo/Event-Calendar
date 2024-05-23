import { useContext } from "react"
import GlobalContext from "./calendarContext/GlobalContext"
import dayjs from "dayjs"


const CalendarHeader = () => {
  const { monthIndex, setMonthIndex } = useContext(GlobalContext)

  const handlePrevMonth = () => {
    setMonthIndex(monthIndex - 1)
  }
  const handleNextMonth = () => {
    setMonthIndex(monthIndex + 1)
  }
  const handleReset = () => {
    setMonthIndex(dayjs().month())
  }
  return (
    <header className="calendar-header">
      <button onClick={handlePrevMonth}>
        <span >
          <i className="fa-solid fa-chevron-left"></i>
        </span>
      </button>
       <h2>
        {dayjs(new Date(dayjs().year(), monthIndex)).format("MMMM YYYY")}
      </h2>
      <button onClick={handleNextMonth}>
        <span>
          <i className="fa-solid fa-chevron-right"></i>
        </span>
      </button>
      <button onClick={handleReset}>Today</button>
         {/* //TODO */}
      <button>Day</button>
      <button>Week</button>
      <button>Work week</button>
     
    </header>
  )
}

export default CalendarHeader