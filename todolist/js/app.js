//Select the elements
const clear = document.querySelector(".clear");
const dateElement = document.getElementById("date");
const list = document.getElementById("list");
const input = document.getElementById("input");
const addBtnEl = document.getElementById("addBtn");


//Classes names
const CHECK = "fa-check-circle";
const UNCHECK = "fa\-circle-thin";
const LINE_THROUGH = "lineThrough";


//Variable
let LIST, id;


//get item from localstore
let data = localStorage.getItem("TODO");
if(data){
    LIST = JSON.parse(data);
    id = LIST.length;
    loadList(LIST);
} else {
    LIST = [];
    id = 0;
}

//load the items
function loadList(array){
    array.forEach(function(item)
    {
        addToDo(item.name, item.id, item.done, item.trash);
    })
}

//clear storage
clear.addEventListener("click", function(){
    localStorage.clear();
    location.reload();
})

//Todays date
const options = {weekday : "long", month:"short", day:"numeric"};
const today = new Date();

dateElement.innerHTML = today.toLocaleDateString("en-US", options);

//Add to do fuction
function addToDo(toDo, id, done, trash){

    if(trash){
        return;
    }
    const DONE = done ? CHECK : UNCHECK;
    const LINE = done ? LINE_THROUGH : "";


    const item = `<li class="item">
                        <i class="fa ${DONE} co" job="complete" id="${id}"></i>
                        <p class="text ${LINE}">${toDo}</p>
                        <i class="fa fa-trash-o de" job="delete" id="${id}"></i>
                </li>
                `;

    const position = "beforeend";

    list.insertAdjacentHTML(position, item);

}


addBtnEl.addEventListener("click", function(event){
    pushTodo(input.value);
});
//Listen to key enter
document.addEventListener("keyup", function(event){
    if(event.keyCode == 13)
    {
        pushTodo(input.value);
    }
});

function pushTodo(inputvalue){

     const toDo = inputvalue;
        //check if input is not empty
        if(toDo){
            addToDo(toDo, id, false, false);

            LIST.push({
                name : toDo,
                id:id,
                done : false,
                trash : false,
            });
            //add item from localstore
            localStorage.setItem("TODO", JSON.stringify(LIST));
            id++;

        }
    input.value = "";
}

// complete to do
function completeToDo(element){
    element.classList.toggle(CHECK);
    element.classList.toggle(UNCHECK);
    element.parentNode.querySelector(".text").classList.toggle(LINE_THROUGH);

    LIST[element.id].done = LIST[element.id].done ? false : true;
}

function removeToDo(element){
    element.parentNode.parentNode.removeChild(element.parentNode);
    LIST[element.id].trash = true;

}

//target the items created
list.addEventListener("click", function(event){
    const element = event.target;
    const elementJob = element.attributes.job.value;

    if(elementJob == "complete"){
        completeToDo(element);
    }else if(elementJob == "delete"){
        removeToDo(element);
    }
    //add item from localstore
    localStorage.setItem("TODO", JSON.stringify(LIST));
});