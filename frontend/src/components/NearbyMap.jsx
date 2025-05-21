import { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { MarkerClusterer } from "@react-google-maps/api"; // Install this package

const mapContainerStyle = {
  width: "100%",
  height: "450px",
};

const customIcon = {
  url: "/custom-marker.png", // Place your custom icon in the public folder
  scaledSize: { width: 40, height: 40 },
};

export default function NearbyMap() {
  const [userPos, setUserPos] = useState(null);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLoc, setSelectedLoc] = useState(null);
  const [directions, setDirections] = useState(null);
  const [map, setMap] = useState(null);
  const [travelMode, setTravelMode] = useState("DRIVING");
  const markerClustererRef = useRef(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setUserPos({ lat: latitude, lng: longitude });

        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(
            "http://localhost:5001/api/locations",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setLocations(response.data);
        } catch (error) {
          setLocations([]);
        } finally {
          setLoading(false);
        }
      },
      () => setLoading(false)
    );
  }, []);

  // Function to get directions from user to selected location
  const handleGetDirections = (loc) => {
    if (!map || !window.google || !userPos) return;
    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: userPos,
        destination: { lat: loc.latitude, lng: loc.longitude },
        travelMode: window.google.maps.TravelMode[travelMode],
      },
      (result, status) => {
        if (status === "OK") {
          setDirections(result);
        }
      }
    );
  };

  // Render clustered markers
  const renderMarkers = (clusterer) =>
    locations.map((loc) => (
      <Marker
        key={loc._id}
        position={{ lat: loc.latitude, lng: loc.longitude }}
        label={loc.name}
        icon={customIcon}
        clusterer={clusterer}
        onClick={() => {
          setSelectedLoc(loc);
          setDirections(null);
        }}
      />
    ));

  if (loading) return <p>Loading map...</p>;
  if (!userPos) return <p>Location not available.</p>;

  return (
    <div>
      <div style={{ margin: "10px 0" }}>
        <label>Travel Mode: </label>
        <select
          value={travelMode}
          onChange={(e) => setTravelMode(e.target.value)}
          style={{ marginLeft: 8 }}
        >
          <option value="DRIVING">Driving</option>
          <option value="WALKING">Walking</option>
          <option value="BICYCLING">Bicycling</option>
          <option value="TRANSIT">Transit</option>
        </select>
      </div>
      <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={userPos}
          zoom={13}
          onLoad={setMap}
          options={{
            mapTypeControl: true,
            fullscreenControl: true,
            streetViewControl: true,
            zoomControl: true,
          }}
        >
          <Marker position={userPos} label="You" />

          {/* Marker Clustering */}
          <MarkerClusterer>
            {(clusterer) => renderMarkers(clusterer)}
          </MarkerClusterer>

          {selectedLoc && (
            <InfoWindow
              position={{
                lat: selectedLoc.latitude,
                lng: selectedLoc.longitude,
              }}
              onCloseClick={() => setSelectedLoc(null)}
            >
              <div>
                <h4>{selectedLoc.name}</h4>
                <p>{selectedLoc.description?.substring(0, 100)}...</p>
                {selectedLoc.addedBy && (
                  <div style={{ display: "flex", alignItems: "center", marginTop: 8 }}>
                    <img
                      src={selectedLoc.addedBy.profileImage || "/default-profile.png"}
                      alt="profile"
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        marginRight: 8,
                        objectFit: "cover",
                      }}
                    />
                    <span>{selectedLoc.addedBy.name}</span>
                  </div>
                )}
                <button
                  onClick={() => handleGetDirections(selectedLoc)}
                  className="bg-blue-500 text-white px-3 py-1 rounded mt-2"
                >
                  Get Directions
                </button>
              </div>
            </InfoWindow>
          )}

          {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}