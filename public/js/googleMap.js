window.onload = () => {
    initMap();
}

function initMap() {
    new google.maps.Map(document.getElementById("map"), {
        center: { lat: 32.089598, lng: 34.802507 },
        zoom: 8,
    });
}


const error = document.getElementById("error");

function openError() {
    error.classList.add("open-popup");

}

function closeError() {
    error.classList.remove("open-popup");
}