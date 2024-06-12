import "./Footer.css"
import AuthContext from "../../context/AuthContext"
import { useContext } from "react"

const Footer = () => {
  const { theme } = useContext(AuthContext);
const { isLoggedIn } = useContext(AuthContext);

  return (
    <footer className={`container-footer ${theme && isLoggedIn.status && "dark-theme-footer"}`}>
      <div> <p>Copyright Calendra 2024</p></div>
      <div>
        <ul className="wrapper">
          <a href="https://www.facebook.com/" target="_blank" className="icon facebook">
            <span className="tooltip">Facebook</span>
            <i className="fa-brands fa-facebook-f fa-lg"></i>
          </a>
          <a href="https://x.com/" target="_blank" className="icon twitter">
            <span className="tooltip">Twitter(X)</span>
            <i className="fa-brands fa-x-twitter fa-lg"></i>
          </a>
          <a href="https://www.instagram.com/" target="_blank" className="icon instagram">
            <span className="tooltip">Instagram</span>
            <i className="fa-brands fa-instagram fa-lg"></i>
          </a>
        </ul>
      </div>
    </footer>
  )
}

export default Footer