import "./App.css";
import arrowIcon from "./images/icon-arrow.svg";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  ZoomControl,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { useState } from "react";
import iconLocation from "./images/icon-location.svg";

function App() {
  const [input, setInput] = useState("");
  const [data, setData] = useState({
    ip_address: "",
    location: "",
    time_zone: "",
    isp: "",
  });
  const [mapConfig, setMapConfig] = useState({
    center: [-6.121435, 106.774124],
    zoom: 13,
  });

  const getData = async (e) => {
    e.preventDefault();
    if (input === "") {
      setData({
        ip_address: "",
        location: "",
        time_zone: "",
        isp: "",
      });
      alert("Input an IP Address!");
    } else {
      await fetch(
        `https://geo.ipify.org/api/v1?apiKey=${process.env.REACT_APP_API_KEY}&ipAddress=` +
          input
      )
        .then((res) => res.json())
        .then((json) => {
          if (json.code === 422) {
            alert("Input is should be IPv4 or IPv6!");
          } else {
            setData({
              ip_address: input,
              location: `${json.location.city}, ${json.location.country}`,
              time_zone: `UTC ${json.location.timezone}`,
              isp: json.isp,
            });
            setMapConfig({
              ...mapConfig,
              center: [json.location.lat, json.location.lng],
            });
          }
        })
        .catch((err) => console.log("error", err));
    }
  };

  const ChangeView = ({ center, zoom }) => {
    const map = useMap();
    map.setView(center, zoom);
    return null;
  };

  const customMarker = L.icon({
    iconUrl: iconLocation,
    iconRetinaUrl: iconLocation,
    iconAnchor: [5, 55],
    popupAnchor: [12, -44],
    iconSize: [35],
  });

  return (
    <div className="body">
      <div className="header">
        <div className="container hero">
          <h1>IP Address Tracker</h1>
          <form className="form" onSubmit={(e) => getData(e)}>
            <input
              className="input"
              placeholder="Search for any IP address or domain"
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className="button">
              <img className="btn-icon" src={arrowIcon} alt="arrow"></img>
            </button>
          </form>
          <div className="container information-wrapper">
            <div className="information">
              <div className="info-item">
                <label className="info-title">IP Address</label>
                <p className="info-text">{data.ip_address}</p>
              </div>
              <div className="info-item">
                <label className="info-title">Location</label>
                <p className="info-text">{data.location}</p>
              </div>
              <div className="info-item">
                <label className="info-title">Time Zone</label>
                <p className="info-text">{data.time_zone}</p>
              </div>
              <div className="info-item">
                <label className="info-title">ISP</label>
                <p className="info-text">{data.isp}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="main">
        <MapContainer
          center={mapConfig.center}
          zoom={mapConfig.zoom}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ZoomControl position="bottomright" />
          <ChangeView center={mapConfig.center} zoom={mapConfig.zoom} />
          {data.ip_address !== "" && (
            <Marker position={mapConfig.center} icon={customMarker}>
              <Popup>{data.ip_address}</Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
    </div>
  );
}

export default App;
