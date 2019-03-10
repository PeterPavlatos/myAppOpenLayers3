$(document).ready(function () {
    /**
     * Add a click handler to the map to render the popup.
     */
    map.on('singleclick', function(evt){
        // Attempt to find a feature in one of the visible vector layers
        var feature = map.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
         return feature;
        });
        if(!feature && changeCursor){
            Poi.addNewPoi(evt);
        }
        showPopUpFeature(feature);
    });

    map.addControl(mousePosition);
    getCountries();
    Poi.get();
    Geofence.get();
    Poi.addMarker();
    toggleSearchResultBox();

    //DEFAULTS
    $(".feature-forms").hide();
    $(".formWrapper").hide();
    $(".btnStartDraw").show();
    $(".btnEndDraw").hide();
    $('[data-toggle="tooltip"]').tooltip(); 
    $(".search-results").hide();
    $(".countries").show();
    $("#toggleSearchBtnExpand").hide();
    document.getElementById("featuresForm").reset();
    document.getElementById("geofenceForm").reset();

    //POI
    $("#cancelPoiBtn").on('click', clearPoiForm);
    $("#addPoiBtn").on('click', addPoi);
    $("#togglePoiFormBtn").on("click",showPoiForm );
    $("#poiBtn").on('click', startMapCursor);
   
    //GEOFENCE
    $("#cancelGeofenceBtn").on("click", clearGeofenceForm);
    $("#addGeofenceBtn").on('click', Geofence.add);
    $("#toggleGeoFormBtn").on("click",showGeoForm );
    $(".geoTypeBtn").on("click", toggleDrawGeo);
    $("#geofenceType").val("");
   
    //MAP
    $("#geolocation").on('click', getGeolocation);
    $("#defaultLocation").on('click', defaultLocation);
    $(".layers input[type=radio").on('change', changeMapLayers);
    
    //MAIN TABS
    $("#tab > a.btn").on("click", toggleLists);
    $(".btnCloseForm").on("click", closeForm);
    $(".toggleSearchBtn").on("click",toggleSearchWrapper );
    $('[data-search]').on('keyup', filterSearchBox);
    $("#search-btn-remove").on('click', emptySearchField);
    
    // $(".geoStyleType label.btn input").change(function(){
    //     // console.log("+++++++++ this", this);

    //     $(".geoStyleType label.btn").removeClass("checked");
    //     $(this).parent().addClass("checked");
    // });
   
});

let Map = new MapModule();
let Poi = new PoiModule();
let Geofence = new GeofenceModule();

function toggleSearchWrapper(){
    var el = $(".search-wrapper");
    el.toggleClass("closed");
    $(".formWrapper").hide();
}
function showPoiForm(){
    var el =  $("#featuresFormWrapper");
    $(".showFormBtn").hide();
    if(el.is(":hidden")){
        el.show();
        $("#togglePoiFormBtn").show();
    }else{
        el.hide();
        $("#togglePoiFormBtn").hide();
    }
}
function showGeoForm(){
    var el =  $("#geofenceFormWrapper");
    $(".showFormBtn").hide();
    if(el.is(":hidden")){
        el.show();
        $("#toggleGeoFormBtn").show();
    }else{
        el.hide();
        $("#toggleGeoFormBtn").hide();
    }
}
function toggleDrawGeo(){
    var el =  $("#selectGeoType");
   
    if(el.is(":hidden")){
        el.show();
       // startMapCursor();
        $(".btnStartDraw").hide();
        $(".btnEndDraw").show();
        addInteraction();
       
    }else{
        el.hide();
      //  endMapCursor();
        $(".btnStartDraw").show();
        $(".btnEndDraw").hide();
       
    }
}

function closeForm(){
    $(".formWrapper").hide();
    clearPoiForm();
    clearGeofenceForm();
    endMapCursor();
}

function toggleLists(){
    var id = $(this).attr("id");
    $("#tab > a").removeClass("active");
    $("#"+id).addClass("active");
    $(".showFormBtn").hide();
    $(".search-results").hide();
    $("."+id).show();
}


var defaultCoord = [0, 0];
/**
* Elements that make up the popup.
*/
var container = document.getElementById('popup');

/**
 * Create an overlay to anchor the popup to the map.
 */
const popup = new ol.Overlay({
    element: container,
    autoPan: true,
    autoPanAnimation: {
        duration: 250
    }
});

const view = new ol.View({
    center: defaultCoord,
    zoom: 4,
    maxZoom: 18,
    minZoom: 2
});

const map = new ol.Map({
    target: "map",
    controls: ol.control.defaults().extend([
        new ol.control.ScaleLine(),
        //new ol.control.FullScreen()
        //new ol.control.ZoomSlider()
    ]),
    renderer: "canvas",
    layers: [osm, MapboxStreet, MapboxSat],
    // layers: [
    //     new ol.layer.Tile({
    //         source: new ol.source.OSM()
    //     })
    // ],
    overlays: [popup],
    view: view
});

const mousePosition = new ol.control.MousePosition({
    coordinateFormat: ol.coordinate.createStringXY(2),
    projection: 'EPSG:4326',
    target: document.getElementById('myposition'),
    undefinedHTML: '&nbsp;'
});

var changeCursor = false;

function startMapCursor(){
    changeCursor = true;
    $("#map").addClass("cursor");
}
function endMapCursor(){
    changeCursor = false;
    $("#map").removeClass("cursor");
}

// Show selected feature popup information
function showPopUpFeature(feature) {
    // Hide existing popup and reset it's offset
    closePopUp();
    // Attempt to find a feature in one of the visible vector layers
    // var feature = map.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
    //     return feature;
    // });
   // console.log("++++++ feature", feature);
    if (feature) {
        $(container).show();
        var coord = feature.getGeometry().getCoordinates();
        var props = feature.getProperties();
        var degrees = ol.proj.transform(coord, 'EPSG:3857', 'EPSG:4326');
        if(!props.longLat) return;
        // console.log("++++++ props", props);
        // console.log("++++++ coord", coord);
        var long = props.longLat[0];
        var lat = props.longLat[1];
       
        // var name = props.name;
        // var type = props.type;
       //// console.log("+++++++++ props", props);
        $(container).html(
                            "<a href='#' onclick='Map.centerFeature(" + long + ", " + lat + ")' class='btn btn-sm btn-default' title='Center To Map'><i class='fas fa-crosshairs'></i></a>"+
                            "<a href='#' onclick='Map.zoomIntoFeature(" + long + ", " + lat + ")' class='btn btn-sm btn-default' title='Zoom In'><i class='fas fa-search-plus'></i></a>"+
                            "<a href='#' onclick='closePopUp()' id='popup-closer' class='ol-popup-closer' title='Close'><i class='fas fa-times'></i></a>"+
                            "<div id='popup-content'>"+
                                "<h2>"+ props.name +"</h2>"+
                                "<p>" + props.type + "</p>"+
                                "<p>(Longitude - Latitude)</p><code>" + degrees + "</code>"+
                            "</div>");
        // Offset the popup so it points at the middle of the marker not the tip
        popup.setOffset([0, -28]);
        // Set coordinates
        popup.setPosition(coord);
        // and add it to the map
        map.addOverlay(popup);
    }
}

function filterSearchBox(){
    var searchVal = $(this).val();
    var filterItems = $('.search-results p');
    var boxId = $("#tab").find(".active").attr("id");
    toggleSearchResultBox(searchVal, boxId);
	if ( searchVal != '' ) {
		filterItems.addClass('hidden');
		$('.search-results [data-filter-name*="' + searchVal.toLowerCase() + '"]').removeClass('hidden');
	} else {
		filterItems.removeClass('hidden');
	}
}
	
function emptySearchField(){
    $("#search-box input").val("");
    $('.search-results p').removeClass('hidden');
    $("#search-btn-search").show();
    $("#search-btn-remove").hide();
}

function toggleSearchResultBox(value, boxId){
    var $box = $("#"+boxId);
    var $btnSearch = $("#search-btn-search");
    var $btnRemove = $("#search-btn-remove");
    if(value == undefined) {
        $btnSearch.show();
        $btnRemove.hide();
        return;
    } 
    if(value.length > 0){
        $btnSearch.hide();
        $btnRemove.show();

    }else{
        $box.show();
        $btnSearch.show();
        $btnRemove.hide();
    }
}

function getCountries(){
    //Populate coutries
    $.get("https://restcountries.eu/rest/v2/all", function(data) {
        $("#totalCountries").append( data.length );
        $.each(data, function (i, item) {
            var name = item.name.toLowerCase();    
            var html = "<p data-filter-name='"+name+"'>"+
                            "<img src='"+ item.flag +"' width='20px' alt='"+name+"' />"+
                            item.name+
                            "<button type='button' class='btn btn-default btn-sm loacte-img pull-right' onclick='Map.centerFeature("+item.latlng[1]+","+item.latlng[0]+")' >"+
                                "<i class='fas fa-crosshairs'></i>"+
                            "</button>"+
                        "</p>";
            $("#countries-list").append( html );
        });
    });
}

function toggleActionPoiBtn(id){
    $("#actionPoiBtn"+id).toggle();
}

function closePoiItems(){
    $(".feature-forms").hide();
    $(".editPoiBtn").hide();
    $(".actionPoiBtn").hide();
}

function togglePoiForm(id, el){
    if($("#"+id).is(":hidden")){
        closePoiItems();
        $(el).siblings(".editPoiBtn").show();
        $("#"+id).show();
    }else{
        $("#"+id).hide();
        closePoiItems();
    }
}
function clearGeofenceForm(){
    document.getElementById("geofenceForm").reset();
    endMapCursor();
    Geofence.coords = [];
    $("#coords").empty();
}
function clearPoiForm(){
    document.getElementById("featuresForm").reset();
    endMapCursor();
 }

function closePopUp() {
    $(container).hide();
    return false;
};
     
function getGeolocation(){
    Map.getGeolocation();
 }
     
function defaultLocation(){
    Map.defaultLocation();
 }
     
function changeMapLayers(){
     var layer = $(this).val();
     map.getLayers().getArray().forEach(function(e){
         var name = e.get("name");
         e.setVisible(name == layer);
     });
 }

/* Zoom Map */
var overview = new ol.control.OverviewMap({
    options: {
        collapsed: false,
        maxResolution: 0.0015,
        numZoomLevels: 5
    }
});
map.addControl(overview);


/* Notification pop up / bottom left corner */
function notification(title, msg){
    var $notify = $("#notify");
    var $title = $("#notifyTitle");
    var $msg = $("#notifyMsg");
    $title.html(title);
    $msg.html(msg);
    $notify.addClass("active");
    setTimeout(function(){ 
        $notify.removeClass("active");
    }, 5000);
}

var source = new ol.source.Vector();
 
// var vector = new ol.layer.Vector({
//   source: source,
//   style: new ol.style.Style({
//     fill: new ol.style.Fill({
//       color: 'rgba(255, 255, 255, 0.2)'
//     }),
//     stroke: new ol.style.Stroke({
//       color: '#ffcc33',
//       width: 2
//     }),
//     image: new ol.style.Circle({
//       radius: 7,
//       fill: new ol.style.Fill({
//         color: '#ffcc33'
//       })
//     })
//   })
// });


var typeSelect = document.getElementById('measure');
var element_coords = document.getElementById('coords');

/**
 * Let user change the geometry type.
 * @param {Event} e Change event.
 */
typeSelect.onchange = function(e) {
    map.removeInteraction(draw);
    addInteraction();
};

var draw; // global so we can remove it later
function addInteraction() {
 
  var value = typeSelect.value;
  // console.log("+++++++++++++++ addInteraction", value);
  if (value !== 'None') {
    startMapCursor();
    var geometryFunction, maxPoints;
    if (value === 'Square') {
      value = 'Circle';
      geometryFunction = ol.interaction.Draw.createRegularPolygon(4);
    } else if (value === 'Box') {
      value = 'LineString';
      maxPoints = 2;
      geometryFunction = function(coordinates, geometry) {
        if (!geometry) {
          geometry = new ol.geom.Polygon(null);
        }
        var start = coordinates[0];
        var end = coordinates[1];
        geometry.setCoordinates([
          [start, [start[0], end[1]], end, [end[0], start[1]], start]
        ]);
        return geometry;
      };
    }
    draw = new ol.interaction.Draw({
      source: new ol.source.Vector(),
      type: /** @type {ol.geom.GeometryType} */ (value),
      geometryFunction: geometryFunction,
      maxPoints: maxPoints,
      style: Geofence.geofenceStyle()
    });
    map.addInteraction(draw);
    
    draw.on('drawend', function(evt){
        $("#coords").empty();
        var feature = evt.feature;
        var geom = feature.getGeometry();
        var coords = geom.getCoordinates();
       
        Geofence.coords = [];
        if(geom instanceof ol.geom.Polygon){
            // console.log("+++++++++++ geom", coords);
            coords[0].forEach(function(each){
                // console.log("+++++++++++ each", each);
                var formated = ol.coordinate.toStringXY(each, 2);
                Geofence.coords.push(each);
                element_coords.innerHTML += formated + '<br>';
            });
        }
        
        $("#geofenceType").val($('#measure').val());
        $('#measure').val("None").change();
        toggleDrawGeo();
        endMapCursor();
        $("#coords").attr("data-coords",  _.flatten(Geofence.coords));
        // console.log("+++++++++++++++++++++++++++++++++ ",  _.flatten(Geofence.coords));
    });
  }
//   if (value !== 'None') {
//     draw = new ol.interaction.Draw({
//       source: source,
//       type: /** @type {ol.geom.GeometryType} */ (value)
//     });
//     map.addInteraction(draw);
//   }
}



//POI STUFF
function addPoi(){
    var name = $("#poiName").val();
    var description = $("#poiDescription").val();
    var longitude = $("#txtPoiFormLong").val();
    var latitude = $("#txtPoiFormLat").val();
    if(name == "" || description == "" || longitude == "" || latitude == ""){
    notification(null, "All fields need to be filled!");
    return;
    }
    var obj = { "name": name,
            "description": description,
            "longitude": longitude,
            "latitude": latitude,
            "img": "poi.png"
    };
    // console.log("+++ data ++", obj);
    Poi.add(obj);
}

function editPoi(id){
    var form = $("#"+id).children("form");
    var id = form.find('[name=id]').val();
    var name = form.find('[name=name]').val();
    var description = form.find('[name=description]').val();
    var longitude = form.find('[name=longitude]').val();
    var latitude = form.find('[name=latitude]').val();
    if(name == "" || description == "" || longitude == "" || latitude == ""){
       notification(null, "All fields need to be filled!");
       return;
    }
    var obj = { "id": id,
              "name": name,
              "description": description,
               "longitude": longitude,
               "latitude": latitude,
               "img": "poi.png"
    };
    Poi.edit(obj);
}

function deletePoi(id){
    var obj = {"id": id};
    Poi.delete(obj);
}


  
 

