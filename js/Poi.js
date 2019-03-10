class PoiModule {
    constructor() {
        //code
        
    }

    
    addNewPoi(evt){
        var lonlat = ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326');
        var longitude = lonlat[0];
        var latitude = lonlat[1];
        $("#txtPoiFormLong").val(longitude);
        $("#txtPoiFormLat").val(latitude);
        longitude = $("#txtPoiFormLong").val();
        latitude = $("#txtPoiFormLat").val();
    
        var data = [{
            name: "",
            description: "",
            img: "poi.png",
            longitude: longitude, 
            latitude:  latitude, 
        }];
        console.log("+++++++++++++++++ ADD pois", data);
        //mapCursor();
        Poi.addMarker(data);
    }


    get(){
        $("#features-list > div").html("<i class='fas fa-spinner fa-spin'></i>");
        // Populate Markers on Map
        $.ajax({
            url: 'php/getPoi.php',
            type: "GET",
            dataType: "json",
            success: function(res){
                console.log("+++++++++++++++++ GET pois", res);
                Poi.addMarker(res);
                Poi.populate(res);
            },
            error: function(err){
               console.log(err);
               $("#features-list").append( "Failed to get POI from server!" );
            }
        });
    }

    populate(data){
        $("#totalPois").html( data.length );
        $("#features-list > div").remove();
        $.each(data, function (i, item) {
            var name = item.name.toLowerCase(); 
            var html = "<div> <p data-filter-name='"+name+"' >"+
                            "<i class='fas fa-map-marker-alt'></i>"+
                            "<a onclick='togglePoiForm("+item.id+", this)'>"+ item.name +"</a>"+
                            "<button type='button' class='btn btn-default btn-sm loacte-img pull-right' onclick='Map.zoomIntoFeature("+Number(item.longitude)+","+Number(item.latitude)+")'>"+
                                "<i class='fas fa-search-plus'></i>"+
                            "</button>"+
                            "<button type='button' class='btn btn-default btn-sm loacte-img pull-right' onclick='Map.centerFeature("+Number(item.longitude)+","+Number(item.latitude)+")' >"+
                                "<i class='fas fa-crosshairs'></i>"+
                            "</button>"+
                            "<button type='button' class='btn btn-default btn-sm loacte-img pull-right editPoiBtn' onclick='toggleActionPoiBtn("+item.id+")'>"+
                                "<i class='fas fa-edit'></i>"+
                            "</button>"+
                        "</p>"+
                        "<div id='"+item.id+"' class='feature-forms'>"+
                            "<form novalidate>"+
                                "<div class='input-group'>"+
                                    "<span class='input-group-addon'>Name</span>"+
                                    "<input type='text' value='"+name+"' name='name' class='form-control' id='name'>"+
                                "</div>"+
                                "<div class='input-group'>"+
                                    "<span class='input-group-addon'>Description</span>"+
                                    "<input type='text' value='"+item.description+"' name='description' class='form-control' id='Description'>"+
                                "</div>"+
                                "<div class='input-group'>"+
                                    "<span class='input-group-addon'>Longitude</span>"+
                                    "<input type='text' value='"+item.longitude+"' name='longitude' class='form-control' id='longitude'>"+
                                "</div>"+
                                "<div class='input-group'>"+
                                    "<span class='input-group-addon'>Latitude</span>"+
                                    "<input type='text' value='"+item.latitude+"' name='latitude' class='form-control' id='latitude'>"+
                                "</div>"+
                                "<input type='hidden' value='"+item.id+"'  name='id' class='form-control' id='"+item.id+"'>"+
                                "<div id='actionPoiBtn"+item.id+"' class='actionPoiBtn'>"+
                                    "<button type='button' class='btn btn-danger btn-sm loacte-img pull-right' onclick='deletePoi("+item.id+")'>"+
                                        "<i class='fas fa-trash-alt'></i> Delete"+
                                    "</button>"+
                                    "<button type='button' class='btn btn-primary btn-sm loacte-img pull-right' onclick='editPoi("+item.id+")'>"+
                                        "<i class='fas fa-check'></i> Save"+
                                    "</button>"+
                                "</div>"+
                            "</form>"+
                        "</div></div>";
            $("#features-list").append( html );
        });
        closePoiItems();
    }

    add(obj){
        $.ajax({ 
            url: 'php/addPoi.php',
            type: "POST",
            dataType: "json",
            data: obj,
            success: function(res){
               console.log("+++ response ++", res);
               notification(null, res);
               Poi.get();
               Poi.addMarker();
               clearPoiForm();
            },
            error: function(err){
                console.log(err);
                notification(null, err);
            }
        });
    }

    edit(obj){
        //console.log("+++ this +++", this);
         $.ajax({
             url: 'php/updatePoi.php',
             type: "POST",
             dataType: "json",
             data: obj,
             success: function(res){
                notification(null, res);
                Poi.get();
                Poi.addMarker();
                console.log("+++ SUCCESS ++", res);
             },
             error: function(err){
                console.log("+++ ERROR ++", err);
                notification(null, err);
             }
         });
     }

     delete(obj){
        if ( confirm("Are you sure you want to delete this poi?")) {
            $.ajax({
                url: 'php/deletePoi.php',
                type: "POST",
                dataType: "json",
                data: obj,
                success: function(res){
                    console.log("+++ response ++", res);
                    notification(null, res);
                    
                    Poi.get();
                    addPoiMarkers();
                },
                error: function(err){
                    console.log("Error:", err);
                    notification(null, err);
                }
            });
        }    
    }
    

    addMarker(data){
        $.each(data, function (i, item) {
            var coord = [Number(item.longitude), Number(item.latitude)];
            // MARKERS
            var markers = new ol.layer.Vector({
                source: new ol.source.Vector({
                features: [
                    new ol.Feature({
                    geometry: new ol.geom.Point(ol.proj.fromLonLat(coord)),
                    name: item.name,
                    type: item.description,
                    longLat: coord
                    })
                ]
                }),
                // ICON STYLES
                style:  new ol.style.Style({
                    image: new ol.style.Icon({
                    opacity: 1,
                    src: "images/"+item.img,
                    anchor: [0.5, 1],
                    // the scale factor
                    scale: 1.5
                    })
                })
            });
            // Add layer to map
            map.addLayer(markers);
            endMapCursor();
            //$("#map").removeClass("cursor");
        });
    }

    
}
