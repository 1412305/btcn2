$(function(){
    //init google maps
    initMap();
    //init media dialog
    dialog =  $( "#media-dialog" );
    dialog.dialog({
        autoOpen: false,
        show: {
          effect: "fold",
          duration: 500
        },
        hide: {
          effect: "explode",
          duration: 500
        },
        draggable: false,
        resizeable: false,
        width: 800,
     });
    //if clicks on "Geocode"
    $("#btn-geocode").click(function(){
        let address = $("#address").val();
        //get lat and lng from address
        geocode(address);
    });
});


function initMap() {
    var uluru = {lat: -25.363, lng: 131.044};
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        center: uluru
    })
}

function geocode(address) {
    //first call google api to geocode the address
    $.ajax({
        url: "https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&key=AIzaSyAHD9t1hUx4mTzEHIm3j9s7pUHVn6bNwAw",
        dataType: 'json',
        success: function(data) {
            //get latlng from the data that was returned by Google
            var latlng = getLatLng(data);
            //center maps to this address
            map.setCenter(new google.maps.LatLng(latlng[0], latlng[1]));
            //set zoom
            map.setZoom(8);
            //call Instagram api to get all 
            //the locations near the searching address
            $.ajax({
                url: "https://api.instagram.com/v1/locations/search?lat=" + latlng[0] +"&lng=" + latlng[1] + "&access_token=5331015627.e029fea.b63c62c0d6a444ce8664fab6460ca45c&callback=?",
                dataType: 'jsonp',
                success: function(locations){
                    //loop through the list of locations 
                    //near the searching address above
                    locations.data.forEach(function(location){
                        //add markers to map
                        var pos = new google.maps.LatLng(location.latitude, location.longitude);
                        var marker = new google.maps.Marker({                      
                            position: pos,
                            title: location.name,
                            map: map
                          }); 
                        //fires 'click' event on marker
                        //show media
                        marker.addListener('click', function() {
                            $.ajax({
                                url: "https://api.instagram.com/v1/media/search?lat=" + marker.position.lat() +"&lng=" + marker.position.lng() + "&access_token=5331015627.e029fea.b63c62c0d6a444ce8664fab6460ca45c&callback=?",
                                dataType: 'jsonp',
                                success: function(media)
                                {
                                    $("#images").html("");
                                    $("#videos").html("");
                                    media.data.forEach(function(item){
                                        if (item.images != null){
                                            $("#images").append(
                                            "<div class='col-2-sm'>" + 
                                                "<img src=" + "'" + item.images.thumbnail.url + "'" + "class='img-thumbnail rounded-circle'/>" +
                                            "</div>"
                                            );
                                        }
                                        if (item.videos != null){
                                            $("#videos").append("<div class='col-4-sm'>" + 
                                                "<iframe" +
                                                    "src=" + "'" + item.videos.standard_resolution.url + "'" +">" +
                                                "</iframe>" + 
                                            "</div>"
                                            );
                                        }
                                    });
                                    $("span.ui-dialog-title").text(marker.title); 
                                    dialog.dialog("open");
                                }
                            })
                        });
                    });
                }
            })
        }
    });
    
    function getLatLng(data) {
        let location = data.results[0].geometry.location;
        return [location.lat, location.lng]
    }
}
