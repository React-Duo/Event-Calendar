import "./ContentPublic.css";
import { assets } from "../../assets/assets";
import { getAllEvents } from "../../service/database-service";
import { useState, useEffect } from "react";
import dayjs from "dayjs";

const ContentPublic = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [eventsToShow, setEventsToShow] = useState([]);
  const [numToShow, setNumToShow] = useState(3);

  const handleShowMore = () => {
    setNumToShow(numToShow + 5);
  };


  useEffect(() => {
    const fetchAndSetEvents = async () => {
      const events = await getAllEvents();
      if (events) {
        const publicEvents = events.filter(event => event[1].visibility === "public" && (event[1].repeat === "single" || event[1].seriesId));
        const uniqueSeriesEvents = publicEvents.reduce((acc, current) => {
          const x = acc.find(item => item[1].seriesId === current[1].seriesId);
          if (!x || !current[1].seriesId) {
            return acc.concat([current]);
          } else {
            return acc;
          }
        }, []);
        setEvents(uniqueSeriesEvents);
        setEventsToShow(uniqueSeriesEvents);
      }
    };
    fetchAndSetEvents();
  }, []);

  useEffect(() => {
    const results = events.filter(event => event[1].title.toLowerCase().includes(searchTerm.toLowerCase()));
    setEventsToShow(results);
  }, [searchTerm]);


  return (
    <div className="content-public">
      <div className="title-public">
        <h1>Simplified Event Scheduling</h1>
        <p>
          Calendo offers seamless event management and an easy way to explore
          all the coolest events. Say goodbye to chaos and hello to organized,
          enjoyable planning.
        </p>
      </div>
      <div>
        <img
          className="content-public-img"
          src={assets.publicHeader}
          alt="demo"
        />
      </div>
      <div>
        <h3 id="users-worldwide">Simplified scheduling for more than 10 million users worldwide</h3>
      </div>
      <div className="partners">
        <div id='container-scroll'>
          <div className='scroll'>
            <div className='item'><img src={assets.company1}></img></div>
            <div className='item'><img src={assets.company2}></img></div>
            <div className='item'><img src={assets.company3}></img></div>
            <div className='item'><img src={assets.company4}></img></div>
            <div className='item'><img src={assets.company1}></img></div>
            <div className='item'><img src={assets.company5}></img></div>
            <div className='item'><img src={assets.company6}></img></div>
            <div className='item'><img src={assets.company7}></img></div>
            <div className='item'><img src={assets.company8}></img></div>
            <div className='item'><img src={assets.company9}></img></div>
            <div className='item'><img src={assets.company10}></img></div>
            <div className='item'><img src={assets.company11}></img></div>
            <div className='item'><img src={assets.company12}></img></div>
            <div className='item'><img src={assets.company13}></img></div>
            <div className='item'><img src={assets.company14}></img></div>
            <div className='item'><img src={assets.company15}></img></div>
            <div className='item'><img src={assets.company16}></img></div>
            <div className='item'><img src={assets.company17}></img></div>
          </div>
        </div>
      </div>
      <div className="public-events-container">
        <div className="search-events">
          <form className="search-events-form" onSubmit={(e) => e.preventDefault()}>
            <button>
              <i className="fa-solid fa-magnifying-glass fa-lg"></i>
            </button>
            <input onChange={(e) => setSearchTerm(e.target.value)} value={searchTerm} className="search-events-input" placeholder="Type your text" type="text" />
          </form>
        </div>
        <div className="public-events">
          {eventsToShow && eventsToShow.length !== 0 ? (
            eventsToShow.slice(0, numToShow).map((event, index) => (
              <div className="single-public-event" key={index}>
                <div><img src={event[1].photo} alt="event cover photo"></img></div>
                <div className="single-public-event-content">
                  <h3>{event[1].title}</h3>
                  <div className="event-date">
                    <p><i className="fa-regular fa-calendar fa-lg"></i>{dayjs(event[1].startDate).format("MMMM D YYYY")}</p>
                    <p><i className="fa-regular fa-clock fa-lg"></i>{event[1].startTime}</p>
                  </div>
                  <p>
                    <i className="fa-solid fa-location-dot fa-lg"></i>
                    {typeof event[1].location === 'string'
                      ? `Online: ${event[1].location}`
                      : `${event[1].location.street}, ${event[1].location.city}`}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p id="no-events-text">No events</p>
          )}
        </div>
        {eventsToShow && eventsToShow.length > numToShow && (
          <button className="cta" onClick={handleShowMore}>  <span className="hover-underline-animation"> Show more </span>
            <i className="fa-solid fa-arrow-right-long fa-lg"></i>
          </button>
        )}
      </div>
    </div>
  );
};

export default ContentPublic;
