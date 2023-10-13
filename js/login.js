
const elLoginForm = get('js-login-form');
const elEmail = get('js-email');
const elPassword= get('js-password');

const elLoginError = get('js-error-msg');
const elEmailError = get('js-email-error');
const elPasswordError = get('js-password-error');


if(localStorage.getItem("token")) {
    window.location.href = "../index.html";
}



elLoginForm.addEventListener('submit', (evt) => {
    
    evt.preventDefault();

    if(!validate(elEmail, "Email", elEmailError, ["email"])) return;
    if(!validate(elPassword, "Password", elPasswordError)) return;

    loginUser();


});







async function loginUser() {
    try {

        const res = await fetch("http://localhost:5000/user/login", {
            method: "POST",
            headers: {
                "Content-Type": "Application/json"
            },
            body: JSON.stringify({
                email: elEmail.value.trim(),
                password: elPassword.value
            })
        })
        .catch(e => {
            console.log(e);
            elLoginError.textContent = "Email or Password is incorrect !";
        });


        if(res.status == 500 || res.ok == false) {
            elLoginError.textContent = "Email or Password is incorrect !";
            return;
        }

        const data = await res.json();

        if(data.token) {
            elLoginError.textContent = '';
            window.localStorage.setItem("token", data.token);
            window.localStorage.setItem("email", elEmail.value.trim());
            window.location.href = "../index.html";
        }


    }catch(e) {
        console.log(e);
        elLoginError.textContent = "Email or Password is incorrect !";
    }
}











function validate(el, elName, elErr, options = []) {
    if(elName === "Password" ? el.value.length == 0 : el.value.trim().length == 0) {
            el.classList.add('is-invalid');
            el.classList.remove("is-valid");
            elErr.textContent = `${elName} field is required !`;
            return false;
        }

    if(options.length > 0) {
        for(let option of options) {
            if(option === 'email') {
                const RegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                if(!RegEx.test(el.value.trim())) {
                    el.classList.add('is-invalid');
                    el.classList.remove("is-valid");
                    elErr.textContent = `${elName} must be valid email address !`;
                    return false;
                }
            }
        }
    }
        
        el.classList.remove('is-invalid');
        el.classList.add("is-valid");
        elErr.textContent = '';
        return true;
        
}




function get(className) {
    return document.querySelector(`.${className}`);
}