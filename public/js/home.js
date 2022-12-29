// // Import the Cloudinary class.
// import { Cloudinary } from "@cloudinary/url-gen";
// // Import any actions and qualifiers required for transformations.
// import { thumbnail } from "@cloudinary/url-gen/actions/resize";
// import {focusOn} from "@cloudinary/url-gen/qualifiers/gravity";
// import {FocusOn} from "@cloudinary/url-gen/qualifiers/focusOn";

window.onload = () => {
    sessionCheck();
    logout.addEventListener("click", (event) => {
        event.preventDefault();
        fetch( serverUrl + "session/logout")
            .then(async response => {
                const res = await response.text();
                if (response.status === 200)
                    window.location = "index";
            });
    });
    initMap();

};

const serverUrl = "http://localhost:8080/";

const userName  = document.getElementById("user-name");
const userImg   = document.getElementById("user-image");
const logout    = document.getElementById("logout");

function insertUser(user) {
    userName.innerHTML = user.firstName + " " + user.lastName;
    // //Create a Cloudinary instance and set your cloud name.
    // const cld = new Cloudinary({
    //     cloud: {
    //         cloudName: 'dfp62w83h'
    //     }
    // });
    // // Instantiate a CloudinaryImage object for the image with the public ID, 'front_face'.
    // const myImage = cld.image(user.imgUrl);
    // // Apply the transformation.
    // myImage.resize(thumbnail().width(150).height(150).gravity(focusOn(FocusOn.face())))  // Crop the image, focusing on the face.
    // userImg.src = myImage.toURL();
}

function sessionCheck() {
    fetch( serverUrl + "session/getInfo/")
        .then(async response => {
            const res = await response.json();
            if (response.status !== 200)
                window.location = "index";
            insertUser(res);
        });
}


function initMap() {
    new google.maps.Map(document.getElementById("map"), {
        center: { lat: 32.089598, lng: 34.802507 },
        zoom: 8,
    });
}
