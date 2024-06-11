import "./NotFound.css"
import {assets} from "../../assets/assets"

const NotFound = () => {
  return (
    <div className="not-found">
        <img src={assets.notFound} alt="404 Not Found" />
    </div>
  )
}

export default NotFound