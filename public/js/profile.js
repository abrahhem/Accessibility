window.onload = () => {

    edit.addEventListener("click", (event) => {
        console.log("editing");
        initEditing();
    });

    imgCheck.addEventListener("change", (event) => {
        fileInput.hidden = imgCheck.checked;
        loadedImage.delete = imgCheck.checked
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const user = {
            firstName:  form[0].value,
            lastName:   form[1].value,
            birthDate:  new Date(form[2].value).toLocaleDateString(),
            gender:     form[3].value,
            email:      form[4].value
        };
        if(loadedImage.hasOwnProperty("imgFile")) {
            user["imgFile"] = loadedImage.imgFile;
        }
        if(loadedImage.delete === true) {
            user["imgFile"] = "delete";
        }
        console.log(user);
        const requestOptions = {
            method: "PUT",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        };

        console.log(requestOptions);

        editUser(requestOptions);

    });

}
initPage();

const origin = window.origin;
const userID = window.location.pathname.split('/')[2];


const htmlMain = document.getElementById("main");

const edit = document.getElementById("edit");
const hidden = document.getElementById("hidden");
const form = document.getElementById("profile-form");

const imgCheck = document.getElementById("delete-img");
const preview  = document.getElementById("preview");
const loadedImage = { delete: false }

const fileInput = document.getElementById("hide-profile-image");

const del = document.getElementById("delete-popup");
const error = document.getElementById("error-popup");
const errorMsg = document.getElementById("error-msg");



function FileInput () {
    const file = form[6].files[0];
    let reader = new FileReader();
    reader.onloadend = () => {
        loadedImage["imgFile"] = reader.result;
        preview.src  = reader.result;

    }
    reader.readAsDataURL(file);
}



function initEditing() {
    const inputs  = document.querySelectorAll('.form-control');
    const selects = document.querySelectorAll('.form-select');
    const labels  = document.querySelectorAll('label');

    labels.forEach( label => {
        label.style.paddingLeft = "12px";
    });
    inputs.forEach(input => {
        input.style.background = '#efefef';
        input.disabled = false
        input.style.paddingLeft = "12px";
    });

    selects.forEach(select => {
        select.style.background = '#efefef';
        select.disabled = false;
        select.style.paddingLeft = "12px";
    });

    hidden.hidden = false;
}

function initPage() {
    const inputs  = document.querySelectorAll('.form-control');
    const selects = document.querySelectorAll('.form-select');
    inputs.forEach(input => {
        input.style.background = 'none';
        input.style.margin = "10px 0";
    });

    selects.forEach(select => {
        select.style.background = 'none';
        select.style.margin = "10px 0";
        select.style.boxShadow = "none";
    });
}


function editUser(requestOptions) {

    fetch( origin + "/users/" + userID, requestOptions)
        .then(async response => {
            const res = await response.text();
            if (response.status === 200)
               window.location.reload();
            else
                openError(res);
        });
}


function openDelete() {
    del.classList.add("open-popup");
    htmlMain.classList.add("active-popup");

}

function closeDelete() {
    del.classList.remove("open-popup");
    htmlMain.classList.remove("active-popup");
}

async function Delete() {
    console.log(userID);
    try {
        const response = await fetch(`${origin}/users/${userID}`, {method: "DELETE"});
        if (response.status === 200)
            window.location.reload();
    } catch (err) {
        console.log(err);
    }
}


function openError(msg) {
    errorMsg.innerHTML = msg;
    error.classList.add("open-popup");
    htmlMain.classList.add("active-popup");

}

function closeError() {
    error.classList.remove("open-popup");
    htmlMain.classList.remove("active-popup");
}