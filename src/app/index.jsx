import React from 'react';
import {render} from 'react-dom';

// set access token for Mapbox account
L.mapbox.accessToken = 'pk.eyJ1IjoieWFubnByYXZvIiwiYSI6ImNpcXc5ejR0YzAwMjVodW5uNmx1MXFmYjYifQ.asPhdNiN9PkjYU9N_twPRQ';


var MapBoxMap = React.createClass({
  componentDidMount: function() {
    var map = L.mapbox.map('map', 'yannpravo.0no8oh5l');

    this.props.markers.forEach(function(marker) {
      // call parent callback onUserClick when a marker is clicked on map
      var mark = new L.Marker(marker.latlong).on('click', this.props.onUserClick);
      mark.bindPopup(marker.text);
      mark.addTo(map);
      marker.id = mark._leaflet_id
    }, this);

    // call initMap parent callback when the map is initialized with markers
    this.props.initMap(map, this.props.markers);
  },
  render: function() {
    return (
      <div id="map" />
    );
  }
});

var MarkerCheckbox = React.createClass({
  // when a checkbox is checked/unchecked, call the onUserClick parent callback with the new refs value
  handleChange: function() {
    this.props.onUserClick(
      this.props.markerId,
      this.refs.MarkCheckbox.checked
    );
  },
  render: function () {
    return (
      <div>
        <input
          type="checkbox"
          checked={this.props.statut}
          ref="MarkCheckbox"
          onChange={this.handleChange}
        />
        {this.props.text}
      </div>
    );
  }
});

// parent class
var App = React.createClass({
  getInitialState: function() {
    return {
      map: undefined,
      checkboxes: []
    };
  },
  handleUserClickOnCheckbox: function(id, isChecked) {
    this.setState(function() {
      // check/uncheck selected checkbox, uncheck others
      this.state.checkboxes.forEach(function(element, index) {
        element.id == id ? element.checked = isChecked : element.checked = false
      });
      // call mapbox function to open/close popup
      isChecked ? this.state.map._layers[id].openPopup() : this.state.map._layers[id].closePopup();
    });
  },
  handleUserClickOnMarker: function(marker) {
    this.setState(function() {
      // check/uncheck checkbox from selected marker, uncheck others
      this.state.checkboxes.forEach(function(element, index) {
        element.id == marker.target._leaflet_id ? element.checked = !marker.target.getPopup()._isOpen : element.checked = false
      });
    });
  },
  initMap: function(map, markers) {
    this.setState({
      map: map,
      checkboxes: markers
    });
    window.aaa = map
  },
  render: function() {
    var checkboxes = [];
    this.state.checkboxes.forEach(function(checkbox) {
      // create MarkerCheckbox elements with MARKERS variable
      checkboxes.push(<MarkerCheckbox markerId={checkbox.id} statut={checkbox.checked} onUserClick={this.handleUserClickOnCheckbox} key={checkbox.id} text={checkbox.text} />);
    }, this);
    return (
      <div>
        {checkboxes}
        <MapBoxMap
          initMap={this.initMap}
          markers={this.props.checkboxes}
          onUserClick={this.handleUserClickOnMarker}
        />
      </div>
    );
  }
});

// markers and checkboxes
var MARKERS = [
  { latlong: [48.858249, 2.2943830000000105], checked: false, text: 'Tour Eiffel'},
  { latlong: [48.860423, 2.338584999999995], checked: false, text: 'Musée du Louvre'}
]

render(<App checkboxes={MARKERS}/>, document.getElementById('app'));