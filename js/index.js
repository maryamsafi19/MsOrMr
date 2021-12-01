const form = document.querySelector("form");
const submitButton = document.querySelector("#submit");
const saveButton = document.querySelector("#save");
const clearButton = document.querySelector("#clear");
const nameTextField = document.querySelector("#name_textfield");
const error = document.querySelector('.error');
const predictGender = document.querySelector('.predict__gender');
const predictProb = document.querySelector('.predict__prob');
const savedGenderCard = document.querySelector('.saved');
const savedGenderDiv = document.querySelector('.saved__gender');

let globalName;

// return the text of text field
function getName() {
    return nameTextField.value;
}

// return the selected radio button
function getGender() {
    var data = new FormData(form).entries().next();
    gender = (data.value === null) ? 'male' : data.value[1];
    return gender;
}

// set the response of api in response part of html.
function setPrediction(predict) {
    if (predict["gender"] != null) {
        predictGender.innerHTML = predict["gender"];
        predictProb.innerHTML = predict["probability"];
    }
    else {
        predictGender.innerHTML = "متاسفانه تعیین جنیسیت این اسم دشوار است";
        predictProb.innerHTML = "";
    }
}

// set saved gender in html.
function showSavedGender(name, gender) {
    console.log(`saved value for ${name} is ${gender}`);
    if (gender == null) {
        savedGenderCard.style.display = "none";
    } else {
        savedGenderCard.style.display = "flex";
        savedGenderDiv.innerHTML = gender;
        globalName = name;
    }
}

// clear saved gender. 
function clearGender() {
    console.log(`${globalName} cleared`)
    window.localStorage.removeItem(globalName);
}


// call when click on submit
async function submitName(e) {
    let name = getName();
    if (name == "")
        return;
    e.preventDefault();
    let savedGender = window.localStorage.getItem(name);
    showSavedGender(name, savedGender);
    let predict = await fetchGender(name);

    setPrediction(predict);
}

// save the user data for name and gender. 
async function saveGender(e) {
    console.log("save")
    e.preventDefault();
    let name = getName();
    if (name == "")
        return;
    let gender = getGender();
    window.localStorage.setItem(name, gender);
}

// displays each given message as an error message 
function showError(message) {
    console.log(message);
    error.classList.add('active');
    error.innerHTML = message;
    setTimeout(() => { // removes the error message from screen after 4 seconds.
        error.classList.remove('active');
    }, 4000)
}

// fetch the gender of name.
async function fetchGender(name) {
    try {
        let response = await fetch(`https://api.genderize.io/?name=${name}`);
        let json = await response.json();
        if (response.status != 200) {
            showError(json.message);
            return Promise.reject(`Request failed with error ${response.status}`);
        }
        return json;
    } catch (e) {
        console.log(e);
        showError(e);
    }
}


submitButton.addEventListener("click", submitName);
saveButton.addEventListener("click", saveGender);
clearButton.addEventListener("click", clearGender);