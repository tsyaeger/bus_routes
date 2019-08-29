import React from 'react';

const Trip = ({tripId, isSelected, selectTrip, start, end}) => {

  const tripStyle = {
    position: 'absolute',
    left: `${start}px`,
    width: `${end - start}px`,
    height: '30px',
    border: '1px solid gray',
    color: 'black',
    backgroundColor: isSelected ? 'yellow' : 'white'
  }

  return (
    <div
      className='trip-wrapper'
      style={tripStyle}
      onClick={() => selectTrip(tripId)}>
      <p>{tripId}</p>
    </div>
  )
}
export default Trip;
