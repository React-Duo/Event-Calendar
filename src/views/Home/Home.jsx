import "./Home.css"
import AllEvents from "../../components/AllEvents/AllEvents"
import AuthContext from "../../context/AuthContext"
import { useContext } from "react"

const Home = () => {
  const {theme} = useContext(AuthContext);

  return (
    <div className={`container-content ${theme? "dark-theme" : "light-theme"}`}> 
      <AllEvents />
    </div>
  )
}

export default Home