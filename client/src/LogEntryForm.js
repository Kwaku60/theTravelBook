//adding state to log entry form to see if it's loading

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import { createLogEntry } from './api';

//pass in location as a prop as well as onclose function from app.js
const LogEntryForm = ({ location, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    //using form hooks lib here
    //will need to add register to all inputs and text areas
    const { register, handleSubmit} = useForm();

    //on submit will give us data from the form
    //make api post request 
    //can add long and latitude with the data, as we passed "location" to this form
    const onSubmit = async (data) => {
        try {
            //right on try we'll set loading to true 
            setLoading(true);
            data.latitude = location.latitude;
            data.longitude = location.longitude;
            await createLogEntry(data);
            onClose();
        } catch (error){
            console.error(error);
            //if error happens, update error state. hoping to show error message on the form
            setError(error.message);
            setLoading(false);
        }    
    };

   return( 
       //use that onSubmit fucntion from obove 
        <form  onSubmit={handleSubmit(onSubmit)} className="entry-form">
            { error ? <h3 className="error">{error}</h3> : null}
            <label htmlFor="title">Title</label>
            <input name="title" required ref={register} />
            <label htmlFor="comments">Comments</label>
            <textarea name="comments"rows={3} ref={register}></textarea>
            <label htmlFor="description">Description</label>
            <textarea name="description"rows={3} ref={register}></textarea>
            <label htmlFor="image">Image</label>
            <input name="image" ref={register}/>
            <label htmlFor="visitDate">Visit Date</label>
            <input name="visitDate" type="date" required ref={register} />
            {/* disable the button if we are loading */}
            <button disabled={loading}>{loading ? 'Loading..' : 'Create Entry'}</button>
        </form>
   ); 
};

export default LogEntryForm;