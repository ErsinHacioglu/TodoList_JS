// Tüm elementleri seçmek

const form = document.querySelector("#todoAddForm");
const addInput = document.querySelector("#todoName");
const todoList = document.querySelector(".list-group");
const firstCardBody = document.querySelectorAll(".card-body")[0];
const secondCardBody = document.querySelectorAll(".card-body")[1];
const clearButton = document.querySelector("#clearButton");
const filterInput = document.querySelector("#todoSearch");

let todos = [];

runEvents(); 
 
function runEvents(){
    form.addEventListener("submit",addTodo);
    document.addEventListener("DOMContentLoaded",pageLoaded);
    secondCardBody.addEventListener("click",removeTodoToUI);
    clearButton.addEventListener("click",clearAllTodosEverywhere);
    filterInput.addEventListener("keyup",filter);

}

function addTodo(e){
    const inputText = addInput.value.trim();
    if(inputText==null || inputText==""){
        showAlertOnFirstCardBody("danger","Lütfen boş bırakmayınız!");
    }else{
        //Arayüze ekleme
    addTodoToUI(inputText);
        //storage ekleme
    addTodoToStorage(inputText);
    showAlertOnFirstCardBody("success","todo eklendi.");
    }
    
    

    e.preventDefault();
}

function addTodoToUI(newTodo){
    // <!--
    //                     <li class="list-group-item d-flex justify-content-between">Todo 1
    //                         <a href="#" class="delete-item">
    //                             <i class="fa fa-remove"></i>
    //                         </a>
    //                     </li>
    //                 --> 
    const li = document.createElement("li");
    li.className="list-group-item d-flex justify-content-between";
    li.textContent = newTodo;

    const a = document.createElement("a");
    a.href="#";
    a.className = "delete-item";

    const i = document.createElement("i");
    i.className = "fa fa-remove";

    a.appendChild(i);
    li.appendChild(a);
    todoList.appendChild(li);

    addInput.value = "";
}

function addTodoToStorage(newTodo){
    checkTodosFromStorage();
    todos.push(newTodo);
    localStorage.setItem("todos",JSON.stringify(todos));
}

function checkTodosFromStorage(){
    if(localStorage.getItem("todos")===null){
        todos = [];
    }else{
        todos = JSON.parse(localStorage.getItem("todos"));
    }
}

function showAlertOnFirstCardBody(type, message){
//     <div class="alert alert-success" role="alert">
//   This is a success alert—check it out!
// </div>

const div = document.createElement("div");
div.className = `alert alert-${type}`; //! "alert alert-" + type ile aynı işi görür.
//!litiral template
div.role = "alert";
div.textContent = message;
firstCardBody.appendChild(div);

setTimeout(function(){
    div.remove();
},2500);
}

function pageLoaded(){
    checkTodosFromStorage();
    todos.forEach(function(todo){
        addTodoToUI(todo);
    })
}

function removeTodoToUI(e){
    if(e.target.className==="fa fa-remove"){
        //UI dan silme
        const todo = e.target.parentElement.parentElement;
        todo.remove();

        //storage dan silmek
        removeTodoToStorage(todo.textContent);
        showAlertOnSecondCardBody("warning","Todo başarıyla silindi.");
    }

    e.preventDefault();
}

function removeTodoToStorage(removeTodo){
    checkTodosFromStorage();
    todos.forEach(function(todo,index){
        if(removeTodo===todo){
            todos.splice(index,1);
        }
    });
    localStorage.setItem("todos",JSON.stringify(todos));
}

function clearAllTodosEverywhere(e){
    const todoListesi = document.querySelectorAll(".list-group-item");
    if(todoListesi.length>0){
        //ekrandan silme
        todoListesi.forEach(function(todo){
            todo.remove();
        })
        //storage dan silme
        todos=[];
        localStorage.setItem("todos",JSON.stringify(todos));
        showAlertOnSecondCardBody("success","Todo'lar temizlendi");
    }else{
        showAlertOnSecondCardBody("warning","Silmek için önce todo eklemeniz gerekiyor.")
    }

    e.preventDefault();
}

function showAlertOnSecondCardBody(type, message){
    //     <div class="alert alert-success" role="alert">
//   This is a success alert—check it out!
// </div>

const div = document.createElement("div");
div.className = `alert alert-${type}`; //! "alert alert-" + type ile aynı işi görür.
//!litiral template
div.role = "alert";
div.textContent = message;
secondCardBody.appendChild(div);

setTimeout(function(){
    div.remove();
},2500);
}

function filter(e){
    const filterValue = e.target.value.toLowerCase().trim();
    const todoListesi = document.querySelectorAll(".list-group-item");

    if(todoListesi.length>0){
        todoListesi.forEach(function(todo){
            if(todo.textContent.toLowerCase().trim().includes(filterValue)){
                todo.setAttribute("style","display : block");
            }else{
                todo.setAttribute("style","display : none !important"); //! bunun anlamı boostrapinkini değil benim yazdığım kodu öncelikli kullan demek.
            }
        })
    }else{
        showAlertOnSecondCardBody("warning","Filtreleme yapmak için en az bir todo olmalıdır.")
    }

    e.preventDefault();

}