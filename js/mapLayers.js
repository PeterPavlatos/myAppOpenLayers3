const osm = new ol.layer.Tile({
    source: new ol.source.OSM(),
    visible: true,
    name: "osm"
});

const MapboxSat = new ol.layer.Tile({
    source: new ol.source.XYZ({ 
        url: "https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoicGFjZ2VvIiwiYSI6ImE2ZmE3YTQyNmRjNTVmYTAxMWE2YWZlNGFjZjMzZWVhIn0.wRU0txw3VIEOVtyc8PCYdQ"
    }),
    visible: false,
    name: "MapboxSat"
});

const MapboxStreet = new ol.layer.Tile({
    source: new ol.source.XYZ({ 
        url: "https://api.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoicGFjZ2VvIiwiYSI6ImE2ZmE3YTQyNmRjNTVmYTAxMWE2YWZlNGFjZjMzZWVhIn0.wRU0txw3VIEOVtyc8PCYdQ"        }),
    visible: false,
    name: "MapboxStreet"
});