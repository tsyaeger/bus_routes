import React, {Component} from 'react';
import Bus from './Bus';

class TripsPage extends Component{
  constructor(props){
    super(props)
    this.state = {
      trips: [],
      buses: [],
      selectedTrip: null,
      selectedBus: null,
      busSize: 1440
    }
  }

  componentDidMount(){
    fetch('bus-scheduling-input.json')
    .then(response => response.json())
    .then(trips => {
      const buses = trips.reduce((acc, trip, ix) => {
        const newBus = { busId: ix + 1, tripIds: [trip.id] }
        acc.push(newBus)
        return acc
      },[])
      const busSize = this.setBusWidth(trips)
      this.setState({ trips, buses, busSize })
    })
  }

  setBusWidth = trips => {
    const endTimes = trips.map(trip => trip.endTime)
    return Math.max(...endTimes)
  }

  selectDeselectTrip = tripId => {
    return true
  }

  selectBus = newBusId => {
    return true
  }

  getBusTrips = busTripIds => {
    return this.state.trips.filter(trip => busTripIds.includes(trip.id))
  }

  renderBuses = () => {
    const { buses, selectedTrip } = this.state
    return buses.map((bus,ix) => {
      const busTrips = this.getBusTrips(bus.tripIds)
      return (
        <Bus
          key={ix}
          bus={bus}
          trips={busTrips}
          selectedTrip={selectedTrip}
          selectTrip={this.selectDeselectTrip}
          selectBus={this.selectBus}
        />
      )
    })
  }

  render(){
    const busStyle = { width: `${this.state.busSize}px` }

    return(
      <div id='trips-page'>
      <h1>Trips</h1>
        <div className='buses-wrapper' style={busStyle}>
          {this.renderBuses()}
        </div>
      </div>
    )
  }
};

export default TripsPage;
