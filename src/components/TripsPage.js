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
      selectedTrip = null
    }
    else if(this.state.selectedTrip === null){
      selectedTrip = tripId
    }
    else {
      selectedTrip = tripId
    }
    this.setState({ selectedTrip })
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

  moveTrip = (ogBus, newBus, tripId) => {
    const { buses } = this.state
    console.log(ogBus, newBus)

    this.checkAvailability(newBus, tripId)
    //check availability
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
    console.log("trip",trip)

    const busSched = this.createBusSched(bus)
    console.log("bus sched", busSched)
    if(busSched.length === 0) {
      console.log("sched is empty")
      return true
    }
    if(trip.endTime <= busSched[0][0]) {
      console.log("trip is before first existing")
      return true
    }
    if(trip.startTime > busSched[busSched.length - 1][1]) {
      console.log("trip is after last trip")
      return true
    }

    let vacant = false
    for(var i = 0; i < busSched.length; i++){

      if(i + 1 < busSched.length){
        const endSlot = busSched[i][1]
        const nextStartSlot = busSched[i+1][0]

        if(trip.startTime >= endSlot && trip.endTime <= nextStartSlot) {
          vacant = true
        }
      }
    }
    console.log("is vacant?",vacant)
    console.log("is vacant?",vacant)
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
