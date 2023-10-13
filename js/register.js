const elRegisterForm = get('js-register-form');
const elUsername = get('js-username');
const elPhone = get('js-phone-number');
const elEmail = get('js-email');
const elPassword= get('js-password');

const elUsernameError = get('js-username-error');
const elPhoneError = get('js-phone-error');
const elEmailError = get('js-email-error');
const elPasswordError = get('js-password-error');


elRegisterForm.addEventListener('submit', (evt) => {

    evt.preventDefault();
    
    if(!validate(elUsername, "Username", elUsernameError)) return;
    if(!validate(elPhone, "Phone number", elPhoneError)) return;
    if(!validate(elEmail, "Email", elEmailError, ["email"])) return;
    if(!validate(elPassword, "Password", elPasswordError)) return;

    registerNewUser();

});




async function registerNewUser() {
    try {
        const res = await fetch('http://localhost:5000/user/register', {
            method: "POST",
            headers: {
                "Content-Type": "Application/json"
            },
            body: JSON.stringify({
                user_name: elUsername.value.trim(),
                phone: elPhone.value.trim(),
                email: elEmail.value.trim(),
                password: elPassword.value
            })
        });
        const data = await res.json();

        console.log(data);

        if(data.token) {
            window.localStorage.setItem("token", data.token);
            window.localStorage.setItem("email", elEmail.value.trim());
            window.location.href = "../index.html";
        }

    }catch(e) {
        console.log(e);
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