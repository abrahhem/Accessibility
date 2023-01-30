window.onload = () => {

    fetch( "http://localhost:8080/reports/locations")
        .then(async response => {
            const res = await response.json();
            initMap(res);
        });
}

function initMap(marks) {
    const map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 32.089598, lng: 34.802507 },
        zoom: 8,
    });

    marks.forEach(mark => {
        const Latlng = new google.maps.LatLng(mark.coordinates[0], mark.coordinates[1]);
        console.log(Latlng);
        const marker = new google.maps.Marker({
            position: Latlng,
            title: mark._id
        });
        marker.setMap(map);
    });
}

