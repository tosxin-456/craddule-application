import React, { useState, useEffect } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import ScaleLoader from "react-spinners/ScaleLoader";
import { useNavigate } from 'react-router-dom';

function Loading({label}) {
  return (
    <div className='loadP'>
      <div className='text-center'>
        <ScaleLoader
          color={'#facc04'}
          loading={true}
          size={30}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
        <p className='loadPt'>{label}</p>
        </div>
    </div>
  );
}

export default Loading;
