function compute_delivery_fee(order_id, coordinate){
    //console.log("order_id: "+order_id+" coordinate: "+coordinate);
    $.ajax({
      url: "/orders/calculate_delivery_fee", // this will be routed
      type: 'POST',
      data: {
        order_id: order_id,
        coordinate: coordinate
      },
      async: true,
      dataType: "json",
      error: function(XMLHttpRequest, errorTextStatus, error){
          alert("Failed: "+ errorTextStatus+" ;"+error);
      },
      success: function(ret){
          // here we iterate the json result
          jQuery.each(ret, function(index, value) {
            $("#delivery_fee").append(value.merchant+": "+value.distance+"<br>");
          });
          //$(".cart-quantity").text(ret['quantity']);
          //$(".price-total").text("₱"+ret['total']);
      }
    });
}

function initMap() {
    var input = document.getElementById('address_input');
    var inputLatlng = document.getElementById("latLong");
    var autocomplete = new google.maps.places.Autocomplete(input);
    var geocoder = new google.maps.Geocoder;
    google.maps.event.addListener(autocomplete, 'place_changed', function () {
        var place = autocomplete.getPlace();
        var mapContainer = document.getElementById('map');
        mapContainer.style.maxHeight = '150px';
        let latLng = { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() };
        inputLatlng.value = JSON.stringify(latLng);
        var map = new google.maps.Map(mapContainer, {
            zoom: 18,
            center: latLng
        });
        var marker = new google.maps.Marker({
            position: latLng,
            map: map,
            draggable: true,
            title: place.name
        });
        //console.log("when place changed order_id: "+$('#order_id').val());
        compute_delivery_fee($('#order_id').val(), JSON.stringify(latLng));

        google.maps.event.addListener(marker, 'dragend', function (marker) {
            var latLng = marker.latLng;
            geocoder.geocode({ 'location': latLng }, function (results, status) {
                if (status === 'OK') {
                    if (results[0]) {
                        var input = document.getElementById('address_input');

                        inputLatlng.value = JSON.stringify(latLng);
                        input.value = results[0].formatted_address;
                        //console.log("when marker changed order_id: "+$('#order_id').val());
                        compute_delivery_fee($('#order_id').val(), JSON.stringify(latLng));
                    } else {
                        window.alert('No results found');
                    }
                } else {
                    window.alert('Geocoder failed due to: ' + status);
                }
            });
        });
    });
}
