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
    setWeekOffset(dayjs().week() - dayjs(new Date(dayjs().year(), monthIndex - 1, 1)).week() + 1)
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
    {view === "week" || view ==="workWeek" || view==="day" ? <div className='hours-static'>
                <div></div>
                <div>00</div>
                <div>01</div>
                <div>02</div>
                <div>03</div>
                <div>04</div>
                <div>05</div>
                <div>06</div>
                <div>07</div>
                <div>08</div>
                <div>09</div>
                <div>10</div>
                <div>11</div>
                <div>12</div>
                <div>13</div>
                <div>14</div>
                <div>15</div>
                <div>16</div>
                <div>17</div>
                <div>18</div>
                <div>19</div>
                <div>20</div>
                <div>21</div>
                <div>22</div>
                <div>23</div>
            </div>:""}
      <button onClick={() => {
        if (view === "month") {
          handlePrevMonth()
        } else if(view === "week") {
          handlePrevWeek()
        } else if(view === "day") {
          handlePrevDay()
        } else if(view === "workWeek") {
          handlePrevWeek()
        }
      }}>
        <span >
          <i className="fa-solid fa-chevron-left"></i>
        </span>
      </button>
      <h2>
        {view === "month" && dayjs(new Date(dayjs().year(), monthIndex)).format("MMMM YYYY")}
        {view === "week" && `${dayjs().startOf('week').subtract(1, 'day').add(weekOffset * 7, 'day').format("DD")} - ${dayjs().startOf('week').subtract(1, 'day').add(weekOffset * 7 + 6, 'day').format("DD")}`}        
        {view === "day" && dayjs().add(dayOffset, 'day').format("DD MMMM")}
        {view === "workWeek" && `${dayjs().startOf('week').subtract(1, 'day').add(weekOffset * 7, 'day').format("DD")} - ${dayjs().startOf('week').subtract(1, 'day').add(weekOffset * 7 + 4, 'day').format("DD")}`}
        </h2>
      <button onClick={() => {
        if (view === "month") {
          handleNextMonth()
        } else if(view === "week") {
          handleNextWeek()
        } else if(view === "day") {
          handleNextDay()
        }else if(view === "workWeek") {
          handleNextWeek()
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
        } else if (view === "workWeek") {
          handleResetWeek()
        }
      }}>Today</button>
      <button className={view === "month" ? "selected" : ""} onClick={() => {
        handleReset()
        setView("month")
      }}>Month</button>
      <button className={view === "day" ? "selected" : ""} onClick={()=> {
         handleReset()
        resetDayOffset()
        setView("day")
      }}>Day</button>
      <button className={view === "week" ? "selected" : ""} onClick={() => {
        handleReset()
        setView("week")
      }}>Week</button>
      <button className={view === "workWeek" ? "selected" : ""} onClick={()=> {
         handleReset()
        setView("workWeek")
      }}>Work week</button>

    </header>
  )
}

export default CalendarHeader