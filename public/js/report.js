window.onload = () => {

    const reportID = window.location.pathname.split('/')[2];
    map.innerHTML = "";
    map.hidden = false;
    const LatLng = coords.split(',');
    initMap(LatLng[0], LatLng[1]);
    initChar(reportID);
    rateForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const rate = document.querySelector('input[name="rating"]:checked');
        console.log(rate.value);

        const requestOptions = {
            method: "PUT",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({rank: rate.value})
        };

        fetch( origin + "/reports/rate/" + reportID, requestOptions)
            .then(async response => {
                const res = await response.text();
                if (response.status !== 200) {
                    console.log(res);
                }
                else
                    window.location.reload();
            });
    });

}


const chart = document.getElementById("chart");

const rateForm = document.getElementById("rate");

const map = document.getElementById("map");
const coords = map.innerHTML;


function initChar(reportID) {
    console.log("here")
    fetch( origin + "/reports/statistics/" + reportID)
        .then(async response => {
            const res = await response.json();
            if (response.status !== 200) {
                console.log(res);
            }
            else
                new Chart(chart, res);
        });

}


function initMap(Lat, Lng) {
    const map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: Number(Lat), lng: Number(Lng) },
        zoom: 15,
    });
    new google.maps.Marker({
        position: { lat: Number(Lat), lng: Number(Lng) },
        map,
        title: "Report's location.",
    });
}
