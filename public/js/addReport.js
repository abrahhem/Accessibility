window.onload = () => {


    addImage.addEventListener("click", (event) => {
        addIamgeInput();
    });

    // const geocoder = new google.maps.Geocoder();
    // geocoder.geocode({
    //     address: "לוד, רבי עקיבא 5"
    // }, function(results) {
    //     console.log("my home" + results[0].geometry.location); //LatLng
    // });

    navigator.geolocation.getCurrentPosition(
        function (position) {

            const { latitude, longitude } = position.coords;
            coords.push(latitude);
            coords.push(longitude);
            initMap(latitude, longitude);
        },
        function errorCallback(error) {
            console.log(error)
        }
    );

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const report = {};
        report["description"] = form[0].value;
        report["coordinates"] = coords;
        report["imgFiles"] = photosFile;

        console.log(report);

        const requestOptions = {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(report)
        };

        fetch( origin + "/reports/", requestOptions)
            .then(async response => {
                const res = await response.text();
                if (response.status === 200)
                    console.log("added");
                else
                    console.log("AHHHH");
                alert(res);
            });
    });

}


const origin = window.origin;
const photosFile = {};
const form   = document.getElementById("form");

let imageIndex = 0;
let totalCount = 1;
let deleteBtns;

const addImage = document.getElementById("add-image");
const photos   = document.getElementById("photos");

const coords = [];





function FileInput(index) {
    const imagePreView = document.getElementById(`load-image-${index}`);
    const imageFile = document.getElementById(`image-${index}`);

    const reader = new FileReader();
    reader.onloadend = async () => {
        imagePreView.src =  await reader.result;
        photosFile[index] = await reader.result;
    }
    reader.readAsDataURL(imageFile.files[0]);

}


function initDelete() {
    deleteBtns = document.getElementsByClassName("delete");
    const sz = deleteBtns.length;
    for (let i = 0; i < sz; i++) {
        deleteBtns[i].onclick = function () {
            photos.childNodes[i].remove();
            delete photosFile[this.title];
            totalCount--;
            initDelete();
        }
    }

}

function addIamgeInput() {

    if (totalCount >= 4) {
        alert("You can only upload up to 4 photos per report");
        return;
    }
    imageIndex++;

    const div = document.createElement("div");
    div.className = "row photo mb-2";

    div.innerHTML = `<div class="form-floating p-0 mr-3">
                        <input type="file" class="form-control sign-up-inputs" id="image-${imageIndex}" onChange="FileInput(${imageIndex})" accept="image/*" placeholder="image" required>
                        <label for="image-${imageIndex}">${imageIndex}Image of the place</label>
                    </div>
                    <img id="load-image-${imageIndex}" class="mr-3" src="https://www.chanchao.com.tw/images/default.jpg">
                    <div title="${imageIndex}" class="delete">
                        <i class="fa-solid fa-trash-xmark fa-xl"></i>
                    </div>`;
    totalCount++;
    photos.appendChild(div);
    initDelete();

}



function initMap(Lat, Lng) {
    const map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: Lat, lng: Lng },
        zoom: 17,
    });
    new google.maps.Marker({
        position: { lat: Lat, lng: Lng },
        map,
        title: "Hello World!",
    });
}

