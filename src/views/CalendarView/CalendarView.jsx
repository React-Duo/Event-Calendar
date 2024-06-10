import "./CalendarView.css"
import Calendar from "../../components/Calendar/Calendar"
import ContextWrapper from "../../components/Calendar/calendarContext/ContextWrapper"
import { useContext } from "react"
import AuthContext from "../../context/AuthContext"

const CalendarView = () => {
  const {theme} = useContext(AuthContext);

  return (
    <ContextWrapper>
      <div className={`container-content ${theme && "dark-theme" }`}>
        <Calendar />
      </div>
    </ContextWrapper>
  )
}

export default CalendarView