window.onload = () => {

    fetch( origin + "/reports/locations")
        .then(async response => {
            const res = await response.json();
            console.log(res);
            initMap(res);
        });
}


function initMap(marks) {
    const map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 32.089598, lng: 34.802507 },
        zoom: 15,
    });

    marks.forEach(mark => {
        const Latlng = new google.maps.LatLng(mark.coordinates[0], mark.coordinates[1]);
        const marker = new google.maps.Marker({
            position: Latlng,
            title: mark._id,
            url: `/report/${mark._id}`
        });
        google.maps.event.addListener(marker, 'click', function() {
            window.location.href = marker.url;
            window.open(marker.url, '_blank');
        });
        marker.setMap(map);
    });
}

const origin = window.origin;