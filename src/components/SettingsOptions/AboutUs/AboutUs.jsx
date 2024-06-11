import "./AboutUs.css"
import { assets } from "../../../assets/assets"
import AuthContext from "../../../context/AuthContext"
import { useContext } from "react"

const AboutUs = () => {
    const {theme} = useContext(AuthContext);

    return (
        <div className={`container-content ${theme && "dark-theme" }`}> 
            <div className="about-us-container">
                <div className="about-us-header">
                    <h1>About Us</h1>
                    <p>We are a dedicated team of two, passionate about simplifying your event scheduling. Our journey started with a shared vision to create an intuitive and efficient tool for managing your calendar events.</p>
                </div>
                <div className="about-us-img">
                    <img src={assets.ab}></img>
                </div>
                <div className="about-us-middle">
                    <p>Our mission at <span>Calendo</span> is to provide an easy-to-use, reliable event scheduling solution.</p>
                </div>
                <div className="about-us-end">
                    <h1>Our Team</h1>
                    <div className="our-team-photos">
                        <div className="our-team-person">
                            <img src={assets.petko} />
                            <h3>Petko Petkov</h3>
                            <p>Front-End Developer</p>
                        </div>
                        <div className="our-team-person">
                            <img src={assets.petko} />
                            <h3>Todor Savov</h3>
                            <p>Front-End Developer</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default AboutUs