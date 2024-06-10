import "./SingleEventView.css"
import SingleEvent from "../../components/SingleEvent/SingleEvent"
import AuthContext from "../../context/AuthContext"
import { useContext } from "react"

const SingleEventView = () => {
    const {theme} = useContext(AuthContext);

  return (
    <div className={`container-content ${theme && "dark-single-event" }`}> 
        <SingleEvent />
    </div>
  )
}

export default SingleEventView