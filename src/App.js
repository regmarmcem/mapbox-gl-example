import React from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import MapboxLanguage from '@mapbox/mapbox-gl-language'; // eslint-disable-line import/no-extraneous-dependencies

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API_KEY;

export default class App extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      lng: 139.76712375007364,
      lat: 35.68122074495286,
      zoom: 14,
      features: []
    };
    this.mapContainer = React.createRef();
  }
  componentDidMount() {
    const { lng, lat, zoom } = this.state;
    const map = new mapboxgl.Map({
      container: this.mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom
    });

    const draw = new MapboxDraw({
        displayControlsDefault: false,
        // Select which mapbox-gl-draw control buttons to add to the map.
        controls: {
          polygon: true,
          trash: true
        },
        // Set mapbox-gl-draw to draw by default.
        // The user does not have to click the polygon control button first.
        defaultMode: 'draw_polygon'
    });
    map.addControl(draw);

    const onDrawUpdate = ({ features }) => {
        console.log('onDrawUpdate', JSON.stringify(features[0]));
        const url = "localhost:8080/feature"
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(features[0])
        };
        fetch(url, requestOptions);
    };
        
    map.on('draw.create', onDrawUpdate);
    map.on('draw.delete', onDrawUpdate);
    map.on('draw.update', onDrawUpdate);

    const language = new MapboxLanguage();
    map.addControl(language);

    map.on('move', () => {
      this.setState({
        lng: map.getCenter().lng.toFixed(4),
        lat: map.getCenter().lat.toFixed(4),
        zoom: map.getZoom().toFixed(2)
      });
    });
  }

  render() {

    const { lng, lat, zoom } = this.state;
    return (
      <div>
        <div className="sidebar">
          Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
        </div>
        <div ref={this.mapContainer} className="map-container" />
      </div>
    );
  }
}
