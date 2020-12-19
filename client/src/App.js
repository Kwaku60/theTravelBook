//bringing in useEffect for reactHooks
import React, { useState, useEffect } from 'react';
//useEffect behaves like componentdid mount as we can create a function that only runs once
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import { listLogEntries } from './api';
import LogEntryForm from './LogEntryForm';

const App = () => {
  //set up first as an empty array, before api call made
  const [logEntries, setLogEntries] = useState([]);
  const [showPopup, setShowPopup] = useState({});
  //by default add entry location will be empty, but when set marker will be added there
  const [addEntryLocation, setAddEntryLocation] = useState(null);
  //when this component mounts we want to make a request to our backend for coords
  const [viewport, setViewport] = useState({
    width: '80vw',
    height: '80vh',
    latitude: 52,
    longitude: 11,
    zoom: 2
  });

  const getEntries = async () => {
    const logEntries = await listLogEntries();
    //this will place the entries here in the pre-defined array, so we can use in render function
    setLogEntries(logEntries);
  }

useEffect(() => {
  //when component loads, call get entries
  getEntries();
}, []);//[] empty dependency array, above function will only run once
//could have something here, that if it would change, useEffect would run again, but we only 
//want it to run once here.

//linked to the double click, will grab long and lattitude of location from event object
const showAddMarkerPopup = (event) => {
  const [ longitude, latitude ] = event.lngLat;
  setAddEntryLocation({
    latitude,
    longitude, 
  });
};

  return (
    <ReactMapGL className="interactive-map"
    {...viewport}
    mapStyle="mapbox://styles/kwakuklaus/ckium7u1730ch19padfpjr6aj"
    mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
    onViewportChange={setViewport}
    //on double click popup will be shown where user can enter in new entry data
    onDblClick={showAddMarkerPopup}
    >
      {
        //map over each entry
        //need to use a fragment<> here because we have twodivs at root
        //use a marker, to map location on map
        logEntries.map(entry => (
          //need to pass key to all children, so fragment gets it also 
          //fragments useful, allows for multiple items with no parent
          <React.Fragment key={entry._id}>
            <Marker 
              latitude ={entry.latitude}
              longitude ={entry.longitude} 
              offsetLeft ={-12}
              offsetTop={-24}
            >
            <div  
              onClick={() => setShowPopup({
                //set show pop up with all existing show popups 
                //at this given entry set to true
                [entry._id]: true,
              })}
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
              </div>
            </Marker>
            {
              showPopup[entry._id] ? (
                <Popup
                  latitude ={entry.latitude}
                  longitude ={entry.longitude} 
                  closeButton={true}
                  closeOnClick={false}
                  dynamicPosition={true}
                  //pass empty object to a single showPopup instead of using
                  //... to spread. so one will close at a time.
                  onClose ={() => setShowPopup({})}
                  anchor="top" >
                  <div className="popup">
                    <h3>{entry.title}</h3>
                    <p>{entry.comments}</p>
                    <small>Visited on: {new Date(entry.visitDate).toLocaleDateString()}</small>
                    {entry.image ? <img src={entry.image} alt={entry.title} />: null}
                  </div>
                </Popup>
              ) : null
            }
          </React.Fragment>         
        ))
      }
      {
        //if addEntryLocation exists, show marker and popup, otherwise nothing
        addEntryLocation ? (
          <>
           <Marker 
            latitude ={addEntryLocation.latitude}
            longitude ={addEntryLocation.longitude} 
            offsetLeft ={-12}
            offsetTop={-24}
          >
          <div>
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
            </div>         
          </Marker>
          <Popup
            latitude ={addEntryLocation.latitude}
            longitude ={addEntryLocation.longitude} 
            closeButton={true}
            closeOnClick={false}
            //pass empty object to a single showPopup instead of using
            //... to spread. so one will close at a time.
            onClose ={() => setAddEntryLocation(null)}
            anchor="top" >
            <div className="popup">
              {/* need to pass long and latitude to the log entry form for new entry creations */}
             <LogEntryForm onClose={()=> {
        
               setAddEntryLocation(null); //  close modal
               //call listLogEntries to reset 
               getEntries();
             }} location={addEntryLocation}/>
            </div>
          </Popup>
          </>
        ) : null
      }
      </ReactMapGL>
  );
}

export default App;