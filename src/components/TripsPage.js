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
      busSize: 1440,
      newRowOpen: false,
    }
  }

  componentDidMount(){
    fetch('bus-scheduling-input.json')
    .then(response => response.json())
    .then(trips => {
      const buses = trips.reduce((acc, trip, ix) => {
        const newBus = { id: ix + 1, tripIds: [trip.id] }
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
    let selectedTrip

    if(this.state.selectedTrip === tripId){
      this.removeEmptyBus()
      selectedTrip = null
    }
    else if(this.state.selectedTrip === null){
      this.createEmptyBus()
      selectedTrip = tripId
    }
    else {
      this.removeEmptyBus()
      selectedTrip = tripId
    }
    this.setState({
      selectedTrip
    })
  }

  createEmptyBus = () => {
    const { buses } = this.state
    const newId = Math.max(...buses.map(bus => bus.id)) + 1
    const newBus = { busId: newId, tripIds: [] }
    this.setState({ buses: buses.concat(newBus) })
  }

  removeEmptyBus = (id = -1) => {
    let newBuses
    if(id === -1){
      newBuses = this.state.buses.slice(0, id)
    }
    else {
      newBuses = this.state.buses.filter(bus => bus.id !== id)
      newBuses = newBuses.slice(0, -1)
    }
    this.setState({ buses: newBuses })
  }

  selectBus = newBusId => {
    const { selectedTrip, buses } = this.state
    if(selectedTrip){
      const ogBus = buses.find(bus => {
        if(bus.tripIds.includes(selectedTrip)) return bus
      })
      const newBus = buses.find(bus => bus.id === newBusId)
      this.moveTrip(ogBus, newBus, selectedTrip)
    }
  }

  getBusTrips = busTripIds => {
    return this.state.trips.filter(trip => busTripIds.includes(trip.id))
  }

  removeTripFromBus = (bus, tripId) => {
    const newTrips = bus.tripIds.filter(id => id !== tripId)
    if(newTrips.length === 0) { this.removeEmptyBus(bus.id) }
    return newTrips
  }

  moveTrip = (ogBus, newBus, tripId) => {
    const { buses } = this.state

    if(this.checkAvailability(newBus, tripId)){
      let newBuses = buses.map(bus => {
        if(bus.id === ogBus.id){
          bus.tripIds = this.removeTripFromBus(bus, tripId)
        }
        else if(bus.id === newBus.id){
          bus.tripIds = newBus.tripIds.concat(tripId)
        }
        return bus
      })
      this.setState({ selectedTrip: null }, this.removeEmptyBuses)
    }
  }

  removeEmptyBuses = () => {
    const newBuses = this.state.buses.filter(bus => bus.tripIds.length !== 0)
    this.setState({buses: newBuses})
  }

  createBusSched = bus => {
    const busTrips = this.getBusTrips(bus.tripIds)
    return busTrips.reduce((acc,trip) => {
      const sched = [trip.startTime, trip.endTime]
      acc.push(sched)
      return acc
    }, []).sort((a,b) => a[0] - b[0])
  }

  checkAvailability = (bus, tripId) => {
    let trip = this.state.trips.find(trip => trip.id === tripId)
    const busSched = this.createBusSched(bus)

    if(busSched.length === 0) {
      return true
    }
    if(trip.endTime <= busSched[0][0]) {
      return true
    }
    if(trip.startTime > busSched[busSched.length - 1][1]) {
      return true
    }

    let vacant = false
    for(var i = 0; i < busSched.length; i++){

      if(i + 1 < busSched.length){
        const endExistingTrip = busSched[i][1]
        const nextStartExistingTrip = busSched[i+1][0]

        if(trip.startTime >= endExistingTrip && trip.endTime <= nextStartExistingTrip) {
          vacant = true
        }
      }
    }
    return vacant
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
