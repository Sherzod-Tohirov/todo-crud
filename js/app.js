const elUserEmail = document.querySelector('.user-email');
const elSettingsList = document.querySelector('.settings-list');
const elLogoutBtn = document.querySelector('.logout-btn');

if(!localStorage.getItem("token")) {
    window.location.href = "./views/login.html";
}

const token = localStorage.getItem("token") || '';

if(localStorage.getItem("email")) {
    elUserEmail.textContent = localStorage.getItem("email");
}else {
    elUserEmail.textContent = "User";
}

elUserEmail.addEventListener('click', (evt) => {
    elSettingsList.classList.contains('d-none') ?  elSettingsList.classList.remove('d-none') :  elSettingsList.classList.add('d-none');
    elSettingsList.classList.toggle('d-block');
});

elLogoutBtn.addEventListener('click', (evt) => {
    window.localStorage.removeItem("email");
    window.localStorage.removeItem("token");
    window.location.href = "./views/login.html";
});





// Todo part is here 

const elTodoForm = document.querySelector('.js-todo-form');
const elTodoInput = document.querySelector('.js-todo-name');
const elTodoNameError = document.querySelector('.js-todo-name-error');

elTodoForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    
    if(!validate(elTodoInput, "Todo name", elTodoNameError)) return;
    
    const res = addTodo();
   
    if(res) {
        elTodoForm.reset();
        elTodoInput.classList.remove('is-valid');
    }

});



async function addTodo() {
    try {

        const res = await fetch("http://localhost:5000/todo", {
            method: "POST",
            headers: {
                "Content-Type": "Application/json",
                authorization: token
            },
            body: JSON.stringify({
                text: elTodoInput.value.trim()
            })
        })
        .catch(e => {
            console.log(e);
        });


        if(res.status == 500 || res.ok == false) {
            return;
        }

        const data = await res.json();

        if(data) {
            getTodos();
            return true;
        }



    }catch(e) {
        console.log(e);
    }
}


// Get todos 

const fragment = new DocumentFragment();
const elTodoTemp = document.querySelector('.js-todo-temp');
const elTodoNode = document.querySelector('.js-todo-body');
const noDataTemp = document.querySelector('.js-no-data');
async function getTodos() {
    try {
        const res = await fetch("http://localhost:5000/todo", {
            method: "GET",
            headers: {
                "Content-Type": "Application/json",
                 authorization: token
            }
        });

        const data = await res.json();
        if(data?.length > 0) {
            renderTodo(data, elTodoNode);
            addEventToActionBtn();
        }else {
            renderTodo(data, elTodoNode, true);
        }

    
    }catch(e) {
        console.log(e);
    }
}


function renderTodo(data, node, no_data = false) {
    node.innerHTML = '';

    if(no_data) {
        node.appendChild(noDataTemp.content.cloneNode(true));
        return;
    }

    let id = 1;
    data.forEach(item => {
        
        const temp = elTodoTemp.content.cloneNode(true);
        
        temp.querySelector('.todo-id').textContent = id;
        temp.querySelector('.todo-name').textContent = item.todo_value;
        temp.querySelector('.js-edit-btn').dataset.id = item.id;
        temp.querySelector('.js-delete-btn').dataset.id = item.id;

        id++;
        fragment.appendChild(temp);
    });

    node.appendChild(fragment);
}

getTodos();


// Edit todo 

async function editTodo(value, id) {
    try {

        const res = await fetch(`http://localhost:5000/todo/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "Application/json",
                 authorization: token
            },
            body: JSON.stringify({
                text: value
            })
        });
        const data = await res.json();


        if(data) {
            getTodos();
        }


    }catch(e) {
        console.log(e);
    }
}

// Delete todo

async function deleteTodo(id) {
    try {

        const res = await fetch(`http://localhost:5000/todo/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "Application/json",
                 authorization: token
            }
        });

        if(res.status == 201 && res.ok) {
            getTodos();
        }
        


    }catch(e) {
        console.log(e);
    }
}


function addEventToActionBtn() {
    const editBtns = document.querySelectorAll('.js-edit-btn');
    const deleteBtns = document.querySelectorAll('.js-delete-btn');

    editBtns.forEach(btn => {
        btn.addEventListener('click', (evt) => {
            const oldValue = Array.from(evt.target.closest('.todo-row').children).filter(item => item.classList.contains('todo-name'))[0].textContent;
            const newValue = prompt("Enter new task name: ", oldValue);
    
            if(newValue?.trim().length == 0) return;
            
            editTodo(newValue, btn.dataset.id);
    
    });

    deleteBtns.forEach(btn => {
        btn.addEventListener('click', (evt) => {
            deleteTodo(btn.dataset.id);
        });
    })


    }); 
}




























// Add task button observer 

const addtask = document.querySelector('#addtask');
const addTodoBtn = document.querySelector('.add-todo-btn');
function callback(list) {
    list.forEach(mutation => {
        if(mutation.attributeName === "class") {
            if(mutation.target.classList.contains("show")) addTodoBtn.classList.add('add-minus');
            else addTodoBtn.classList.remove('add-minus');
        }
    })
}


const myObserver = new MutationObserver(callback);

myObserver.observe(addtask, { attributes:true });





// Validation 

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
