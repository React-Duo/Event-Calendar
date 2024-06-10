import { useState, useEffect } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import PropTypes from "prop-types";

const libraries = ["places"];
const mapContainerStyle = {
    width: "350px",
    height: "350px"

};

const GoogleMaps = ({city, street}) => {
    const mapsApiKey = "AIzaSyAu1n1GGluV4924kBUFzl8hgm9s-2JUJF4";
    const [coords, setCoords] = useState(null);

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: mapsApiKey,
        libraries
    });

    useEffect(() => {
        const address = street ? `${street}, ${city}` : city;
        fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${mapsApiKey}`)
            .then(response => response.json())
            .then(data => {
                if (data.status === "OK") {
                    setCoords({
                        lat: data.results[0].geometry.location.lat,
                        lng: data.results[0].geometry.location.lng,
                    });
                } else {
                    console.log(data);
                }
            })
            .catch((e) => {
                console.log(e); 
            });
    }, [city, street]);

    if (loadError) {
        return <div>Error Loading maps</div>;
    }

    if (!isLoaded || !coords) {
        return <div>Loading maps...</div>;
    }

    return (
        <div>
            {isLoaded && (
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={coords}
                    zoom={11}
                >
                    <Marker position={coords} />
                </GoogleMap>
            )}
        </div>
    );
};

GoogleMaps.propTypes = {
    city: PropTypes.string.isRequired,
    street: PropTypes.string
};

export default GoogleMaps;