import "./CalendarView.css"
import Calendar from "../../components/Calendar/Calendar"
import ContextWrapper from "../../components/Calendar/calendarContext/ContextWrapper"
const CalendarView = () => {
  return (
    <ContextWrapper>
      <div className="container-content">
        <Calendar />
      </div>
    </ContextWrapper>
  )
}

export default CalendarView