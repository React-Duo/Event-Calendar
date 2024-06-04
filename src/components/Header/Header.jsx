import "./Header.css";
import { assets } from "../../assets/assets";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import { getUserDetails, getAllEvents } from "../../service/database-service";
import Notifications from "../Notifications/Notifications";
import dayjs from "dayjs"


const Header = () => {
  const [photo, setPhoto] = useState("");
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(AuthContext);
  const [showNotifications, setShowNotifications] = useState(false);
  const [alerts, setAlerts] = useState([])

  const handleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  //Todo: Change the photo dinamically when the user changes it form profile
  useEffect(() => {
    if (isLoggedIn.status) {
      const fetchUserDetails = async () => {
        try {
          const userDetails = await getUserDetails(isLoggedIn.user);
          setPhoto(userDetails[0].photo);
        } catch (error) {
          console.error(error);
        }
      };
      fetchUserDetails();
    }
  }, [isLoggedIn.status, isLoggedIn.user]);

  const handleLoginClick = (event) => {
    event.preventDefault();
    navigate(`/login`);
  }

  const handleRegisterClick = (event) => {
    event.preventDefault();
    navigate(`/register`);
  }

  const handleLogoutClick = (event) => {
    event.preventDefault();
    navigate(`/logout`);
  }

  useEffect(() => {
    const fetchAuthorEvents = async () => {
      const events = await getAllEvents();

      if (events) {
        const myEvents = events.filter(event => event[1].repeat === "single" || event[1].seriesId);
        const uniqueSeriesEvents = myEvents.reduce((acc, current) => {
          const event = acc.find(item => item[1].seriesId === current[1].seriesId);
          if (!event || !current[1].seriesId) {
            return acc.concat([current]);
          } else {
            return acc;
          }
        }, []);

        const now = dayjs();
        const threeDaysFromNow = now.add(3, 'day');
        const alerts = uniqueSeriesEvents.filter(event => {
          const eventDate = dayjs(event[1].startDate);
          return event[1].invited.includes(isLoggedIn.user) && eventDate.isBefore(threeDaysFromNow) && eventDate.isAfter(now);
        }).map(event => event[1]);
        setAlerts(alerts);
      }
    };
    fetchAuthorEvents();
  }, [isLoggedIn.user]);

  return (
    <>
      <div className="header">

        {!isLoggedIn.status ? (
          <>
            <div className="header-logo">
              <img src={assets.logo} alt="logo" />
            </div>
            <div className="header-menu">
              <a id="loginBtn" href="#" onClick={handleLoginClick}>
                Log in
              </a>
              <a id="registerBtn" href="#" onClick={handleRegisterClick}>
                Get started
              </a>
            </div>
          </>
        ) : (
          <div className="header-menu">
            <div className="notifier new">
              <i onClick={handleNotifications} className="bell fa fa-bell-o"></i>
              <div className="badge">{alerts.length}</div>
              {showNotifications && <Notifications alerts={alerts} />}
            </div>
            <div className="header-person">
              <div className="options-header">
                <img
                  onClick={() => navigate("/profile")}
                  src={photo}
                ></img>
              </div>
              <p>{isLoggedIn.user}</p>
              <i className="fa-solid fa-chevron-down fa-sm"></i>
              <div className="options">
                <button onClick={() => navigate("/profile")} className="value"><i className="fa-regular fa-user fa-sm"></i>Public profile</button>
                <button onClick={() => navigate("/settings")} className="value"><i className="fa-solid fa-gear fa-sm"></i>Settings</button>
                <button className="value" onClick={handleLogoutClick}><i className="fa-solid fa-arrow-right-from-bracket fa-sm"></i>Log out</button>
              </div>
            </div>
          </div>
        )}
      </div>
      <hr />
    </>
  );
};

export default Header;
