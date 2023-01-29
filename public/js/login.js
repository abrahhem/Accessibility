window.onload = () => {

    setTimeout(() => {
        container.classList.add('sign-in');
    }, 200);

    SIForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const email = SIInputs[0].value;
        const pass  = SIInputs[1].value;
        login(email, pass);
    });

    SUForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const user = {
            firstName:  SUInputs[0].value,
            lastName:   SUInputs[1].value,
            birthDate:  new Date(SUInputs[2].value).toLocaleDateString(),
            gender:     SUInputs[3].value,
            email:      SUInputs[4].value,
            password:   SUInputs[5].value
        }
        if(preview.uploaded)
            user["imgFile"] = preview.uploaded;
        console.log(user);
        const requestOptions = {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        };
        createUser(requestOptions);
    });
};

const origin  = window.origin;

const container = document.getElementById('cont');
const toggle = () => {
    container.classList.toggle('sign-in')
    container.classList.toggle('sign-up')
}

const SIForm   = document.getElementById("sign-in");
const SIInputs = document.getElementsByClassName("sign-in-inputs");


const SUForm   = document.getElementById("sign-up");
const SUInputs = document.getElementsByClassName("sign-up-inputs");

const preview  = document.getElementById("preview");
let profileImage;

function FileInput () {
    const file = SUInputs[6].files[0];
    let reader = new FileReader();
    reader.onloadend = () => {
        profileImage = reader.result;
        preview.src  = reader.result;
        preview["uploaded"] = reader.result;
    }
    reader.readAsDataURL(file);
}



function login(email, pass) {
    const alert = document.getElementById("alert-sign-in");
    fetch( origin + "/session/login?email=" + email + "&password=" + pass)
        .then(async response => {
            const res = await response.text();
            if (response.status !== 200) {
                alert.innerHTML = res;
                alert.hidden = false;
            }
            else
                window.location = "/home";
        });
}

function createUser(requestOptions) {
    const alert = document.getElementById("alert-sign-up");
    fetch( origin + "/users", requestOptions)
        .then(async response => {
            const res = await response.text();
            if (response.status === 200)
                alert.className = "alert alert-success mt-3";
            else
                alert.className = "alert alert-danger mt-3 error-alert";
            alert.innerHTML = res;
            alert.hidden = false;
        });
}
