import "./SingleList.css"
import ListById from "../../components/ListById/ListById"
import AuthContext from "../../context/AuthContext"
import { useContext } from "react"

const SingleList = () => {
  const {theme} = useContext(AuthContext);
  return (
    <div className={`container-content ${theme && "dark-theme"}`}> 
        <ListById />
    </div>
  )
}

export default SingleList