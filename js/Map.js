class MapModule {
    constructor() {
        //code
        
    }

    centerFeature(long, lat){
        var coord = [long, lat];
        var zoomLevel = map.getView().getZoom();
        view.setCenter(ol.proj.fromLonLat(coord));
        view.animate({ zoom: zoomLevel, duration: 2000 });
    }
    
    zoomIntoFeature(long, lat){
        var coord = [long, lat];
        view.setCenter(ol.proj.fromLonLat(coord));
        view.animate({ zoom: 18, duration: 2000 });
    }

    getGeolocation(){
        navigator.geolocation.getCurrentPosition(function (pos) {
        var coord = [pos.coords.longitude, pos.coords.latitude];
        const data = [{
                        name: "You are here!",
                        longitude: pos.coords.longitude,
                        latitude: pos.coords.latitude,
                        description: "Gothca",
                        img: "geolocate.png"
                    }];
        addPoiMarkers(data);
        view.setCenter(ol.proj.fromLonLat(coord));
        view.animate({ zoom: 18, duration: 2000 });
        });
    }

    defaultLocation(){
        defaultCoord = [0, 0];
        view.animate({ center: defaultCoord, zoom: 2, duration: 1000 });
    }
}
