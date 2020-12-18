//bringing in useEffect for reactHooks
import React, { useState, useEffect } from 'react';
//useEffect behaves like componentdid mount as we can create a function that only runs once
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import { listLogEntries } from './api';

const App = () => {
  //set up first as an empty array, before api call made
  const [logEntries, setLogEntries] = useState([]);
  //when this component mounts we want to make a request to our backend for coords
  const [viewport, setViewport] = useState({
    width: '100vw',
    height: '100vh',
    latitude: 52,
    longitude: 11,
    zoom: 2
  });

useEffect(() => {
  //cannot use async and await with useEffect, so using an immediately invoked function expression
  //with async()
  (async () => {
    const logEntries = await listLogEntries();
    //this will place the entries here in the pre-defined array, so we can use in render function
    setLogEntries(logEntries);
    console.log(logEntries);
  })()

}, []);//[] empty dependency array, above function will only run once
//could have something here, that if it would change, useEffect would run again, but we only 
//want it to run once here.

  return (
    <ReactMapGL
    {...viewport}
    mapStyle="mapbox://styles/kwakuklaus/ckium7u1730ch19padfpjr6aj"
    mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
    onViewportChange={setViewport}
    >
      {
        //map over each entry
        logEntries.map(entry => (
          //use a marker, to map location on map
          <Marker 
          key={entry._id}
            latitude ={entry.latitude}
            longitude ={entry.longitude} 
            offsetLeft ={-12}
            offsetTop={-24}
          >
            <svg className="marker" 
            style ={{
              //make the size relative to size of map
              width: '24px',
              height:'24px',
            }}
            viewBox="0 0 24 24" 
            width="40" 
            height="40" 
            stroke="blue" 
            strokeWidth="2" 
            fill="none" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          </Marker>
      ))
      }
      <Popup
        latitude = {37.28}
        longitude = {-122.41}
        closeButton={true}
        closeOnClick={false}
        onClose ={() => this.setState({showPopup: false})}
        anchor="top">
          <div>You</div>
      </Popup>
      </ReactMapGL>
  );
}

export default App;