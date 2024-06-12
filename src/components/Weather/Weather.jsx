import { useEffect, useState } from "react";
import "./Weather.css"
import PropTypes from "prop-types";

const Weather = ({ city }) => {
    const APIKEY = import.meta.env.VITE_WEATHER_KEY;
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKEY}&units=metric`;
    const [weatherData, setWeatherData] = useState({});
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        console.log("das");
        const getData = async () => {
            const response = await fetch(url);
            const data = await response.json();
            setWeatherData(data);
            setIsLoading(false);
        }
        getData();
    }, [url]);
 
    if (isLoading || !weatherData || !weatherData.weather || !weatherData.main) {
        return <div>Loading...</div>;
    }

    return (
        <div className="weather-container">
            <div className="card">
                <div className="container">
                    <img src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} ></img>
                </div>

                <div className="card-header">
                    <span>{weatherData.name}<br />{weatherData.sys.country}</span>
                    <span>{new Date().toLocaleString('default', { month: 'long' })} {new Date().getDate()}</span>
                </div>
                <div className="card-middle">
                    <p id="card-middle-description">{weatherData.weather[0].description}</p>
                    <p>Max Temp: <span>{weatherData.main.temp_max}</span></p>
                    <p>Min Temp: <span>{weatherData.main.temp_min}</span></p>
                </div>
                <span className="temp">{weatherData.main.temp}°</span>

                <div className="temp-scale">
                    <span>Celcius</span>
                </div>
            </div>
        </div>
    );
}

Weather.propTypes = {
    city: PropTypes.string.isRequired,
};

export default Weather