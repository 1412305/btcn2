$(function(){
    $("#btn-geocode").click(function(){
        let address = $("#address").val();
        console.log(address);
        geocode(address);
    });
});

function geocode(address) {
    $.ajax({
        url: "https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&key=AIzaSyAHD9t1hUx4mTzEHIm3j9s7pUHVn6bNwAw",
        dataType: 'json',
        success: function(data) {
            $.ajax({
                url: "https://api.instagram.com/v1/locations/search?lat=48.858844&lng=2.294351&access_token=5331015627.1677ed0.e22c119cfa8946c69fabd149f5cce110",
                dataType: 'json',
                success: function(location){
                    console.log(data);
                }
            })
        }
    });
}
