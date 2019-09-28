import React from "react";
import GoogleMapReact from "google-map-react";
import PropTypes from "prop-types";
import logger from "sabio-debug";
//import propTypes from "prop-types";

const _logger = logger.extend("location");

const EventMap = props => {
  _logger("Map", props);

  const AnyReactComponent = ({ text }) => (
    <div
      style={{
        position: "absolute",
        width: 40,
        height: 40,
        left: -20,
        top: -20,
        border: "5px solid #f44336",
        borderRadius: 40,
        backgroundColor: "white",
        textAlign: "center",
        color: "#3f51b5",
        fontSize: 16,
        fontWeight: "bold",
        padding: 4
      }}
    >
      {text}
    </div>
  );
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: "" }}
        center={{
          lat: 36.07987594604492,
          // props.event.venue ? props.event.venue.location.latitude : null,
          lng: -94.20304870605469
          //props.event.venue ? props.event.venue.location.longitude : null
        }}
        defaultZoom={15}
      >
        <AnyReactComponent
          // lat={props.event.venue ? props.event.venue.location.latitude : null}
          //lng={props.event.venue ? props.event.venue.location.longitude : null}
          text="A"
        />
      </GoogleMapReact>
    </div>
  );
};
EventMap.propTypes = {
  event: PropTypes.shape({
    venue: PropTypes.any
  }),
  text: PropTypes.any
};
export default EventMap;
