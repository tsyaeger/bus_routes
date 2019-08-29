import React from 'react';
import Trip from './Trip'

const Bus = ({ bus, trips, selectTrip, selectBus, selectedTrip }) => {

  const renderTrips = () => {
    return trips.map((trip,ix) => {
      return (
        <Trip
          key={ix}
          tripId={trip.id}
          start={trip.startTime}
          end={trip.endTime}
          isSelected={ selectedTrip === trip.id ? true : false }
          selectTrip={selectTrip}
        />
      )
    })
  }

  const handleClick = () => {
    if(!bus.tripIds.includes(selectedTrip)){
      selectBus(bus.id)
    }
  }

  return (
    <div
      className='bus-wrapper'
      onClick={handleClick}>
      <div className="bus-id">{bus.id}</div>
      {renderTrips()}
    </div>
  )
}
export default Bus;
