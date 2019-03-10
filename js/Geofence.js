class GeofenceModule {
    constructor() {
        //code
        this.coords= [];
    }

    get(){
        // Populate Markers on Map
        $.ajax({
            url: 'php/getGeofence.php',
            type: "GET",
            dataType: "json",
            success: function(res){
                console.log("+++++++++++++++++ GET GEOFENCE", res);
                // addPoiMarkers(res);
                Geofence.populate(res);
                //$("#geofence-list > div").html("<i class='fas fa-spinner spin'></i>");
            },
            error: function(err){
               console.log(err);
               //$("#features-list").append( "Failed to get POI from server!" );
            }
        });
    }

    populate(data){
        $("#totalGeofences").html( data.length );
        $("#geofence-list > div").remove();
        $.each(data, function (i, item) {
            var name = item.name.toLowerCase(); 
            var html = "<div> <p data-filter-name='"+name+"' >"+
                            "<i class='fas fa-draw-polygon'></i>"+
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
                                    "<span class='input-group-addon'>Type</span>"+
                                    "<input type='text' value='"+item.type+"' name='description' class='form-control' id='Description'>"+
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
                                    "<button type='button' class='btn btn-danger btn-sm loacte-img pull-right' onclick='Geofence.delete("+item.id+")'>"+
                                        "<i class='fas fa-trash-alt'></i> Delete"+
                                    "</button>"+
                                    "<button type='button' class='btn btn-primary btn-sm loacte-img pull-right' onclick='Geofence.edit("+item.id+")'>"+
                                        "<i class='fas fa-check'></i> Save"+
                                    "</button>"+
                                "</div>"+
                            "</form>"+
                        "</div></div>";
            $("#geofence-list").append( html );
        });
        closePoiItems();
    }

    add(){
        console.log("+++ data ++ 1");
        var name = $("#geofenceName").val();
        var description = $("#geofenceDescription").val();
        var coords = $("#coords").data("coords");
        var geofenceType = $("#geofenceType").val();
        // console.log("+++ name ++ 2", name );
        // console.log("+++ description ++ 2", description );
        // console.log("+++ coords ++ 2", coords );
        // console.log("+++ geofenceType ++ 2", geofenceType );
        //var latitude = $("#txtPoiFormLat").val();
        if(name == "" || description == "" || coords == "" ){
           notification(null, "All fields need to be filled!");
           return;
        }
        coords =  _.chunk(_.flattenDeep(Geofence.coords), 2);
        var data = { "name": name,
                   "description": description,
                   "coords":coords, 
                   //"coords": coords,
                   "type": geofenceType
        };
        console.log("+++ data ", data );
        $.ajax({ 
            url: 'php/addGeofence.php',
            type: "POST",
            dataType: "json",
            data: data,
            success: function(res){
               console.log("+++ response ++", res);
               notification(null, res);
               //Geofence.get();
              // Geofence.addMarker();
              clearGeofenceForm(); 
            },
            error: function(err){
                console.log(err);
                notification(null, "There was an ERROR trying to add this. Please try again.");
            }
        });
    }

    edit(id){
        var form = $("#"+id).children("form");
        var id = form.find('[name=id]').val();
        var name = form.find('[name=name]').val();
        var description = form.find('[name=description]').val();
      
        if(name == "" || description == "" ){
           notification(null, "All fields need to be filled!");
           return;
        }
        var data = { "id": id,
                  "name": name,
                  "description": description
        };
        
        $.ajax({
             url: 'php/updateGeofence.php',
             type: "POST",
             dataType: "json",
             data: data,
             success: function(res){
                notification(null, res);
                Geofence.get();
             },
             error: function(err){
                notification(null, err);
             }
        });
     }

     delete(id){
        var data = {"id": id};
       
        if ( confirm("Are you sure you want to delete this geofence?")) {
            $.ajax({
                url: 'php/deleteGeofence.php',
                type: "POST",
                dataType: "json",
                data: data,
                success: function(res){
                    notification(null, res);
                    Geofence.get();
                },
                error: function(err){
                    notification(null, err);
                }
            });
        }    
    }

    getStyleType() {
        return $(".geoStyleType input[name='geoStyleType']:checked"). val();
    }

   geofenceStyle(){
        switch(Geofence.getStyleType()){
    
            case "Inclusive":
            return  new ol.style.Style({
                fill: new ol.style.Fill({
                  color: 'rgba(92,184,92, 0.4)'
                }),
                stroke: new ol.style.Stroke({
                  color: '#5CB85C',
                  width: 3
                })
            });
            case "Exclusive":
            return new ol.style.Style({
                fill: new ol.style.Fill({
                  color: 'rgba(255, 99, 71, 0.4)'
                }),
                stroke: new ol.style.Stroke({
                  color: '#ff6347',
                  width: 3
                })
            });
        }
    }
    
}


// var raster = new ol.layer.Tile({
//     source: new ol.source.MapQuest({layer: 'sat'})
//   });
  
//   var map = new ol.Map({
//     layers: [raster],
//     target: 'map',
//     view: new ol.View({
//       center: [-11000000, 4600000],
//       zoom: 4
//     })
//   });
  
//   // The features are not added to a regular vector layer/source,
//   // but to a feature overlay which holds a collection of features.
//   // This collection is passed to the modify and also the draw
//   // interaction, so that both can add or modify features.
//   var featureOverlay = new ol.FeatureOverlay({
//     style: new ol.style.Style({
//       fill: new ol.style.Fill({
//         color: 'rgba(255, 255, 255, 0.2)'
//       }),
//       stroke: new ol.style.Stroke({
//         color: '#ffcc33',
//         width: 2
//       }),
//       image: new ol.style.Circle({
//         radius: 7,
//         fill: new ol.style.Fill({
//           color: '#ffcc33'
//         })
//       })
//     })
//   });
//   featureOverlay.setMap(map);
  
//   var modify = new ol.interaction.Modify({
//     features: featureOverlay.getFeatures(),
//     // the SHIFT key must be pressed to delete vertices, so
//     // that new vertices can be drawn at the same position
//     // of existing vertices
//     deleteCondition: function(event) {
//       return ol.events.condition.shiftKeyOnly(event) &&
//           ol.events.condition.singleClick(event);
//     }
//   });
//   map.addInteraction(modify);
  
//   var draw; // global so we can remove it later
//   function addInteraction() {
//     draw = new ol.interaction.Draw({
//       features: featureOverlay.getFeatures(),
//       type: /** @type {ol.geom.GeometryType} */ (typeSelect.value)
//     });
//     map.addInteraction(draw);
//   }
  
//   var typeSelect = document.getElementById('type');
  
  
//   /**
//    * Let user change the geometry type.
//    * @param {Event} e Change event.
//    */
//   typeSelect.onchange = function(e) {
//     map.removeInteraction(draw);
//     addInteraction();
//   };
  
//   addInteraction();