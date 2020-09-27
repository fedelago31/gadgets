//SELECT Elements
const balanceEl = document.querySelector(".balance .value");
const incomeTotalEl = document.querySelector(".income-total");
const outcomeTotalEl = document.querySelector(".outcome-total");
const incomeEl = document.querySelector("#income");
const expenseEl = document.querySelector("#expense");
const allEl = document.querySelector("#all");
const incomeList = document.querySelector("#income .list");
const expenseList = document.querySelector("#expense .list");
const allList = document.querySelector("#all .list");

//Slect button
const expenseBtn = document.querySelector(".tab1");
const incomeBtn = document.querySelector(".tab2");
const allBtn = document.querySelector(".tab3");

//select inputs
const addExpense = document.querySelector(".add-expense");
const expenseTitle = document.getElementById("expense-title-input");
const expenseAmount = document.getElementById("expense-amount-input");

const addIncome = document.querySelector(".add-income");
const incomeTitle = document.getElementById("income-title-input");
const incomeAmount = document.getElementById("income-amount-input");

//Vars
let ENTRY_LIST;
let balance = 0;
let income = 0;
let outcome = 0;
const DELETE = "delete";
const EDIT = "edit";

//check for saved data
ENTRY_LIST = JSON.parse(localStorage.getItem("entry_list")) || [];
updateUI();

//Listeners
expenseBtn.addEventListener("click", function(){
    show(expenseEl);
    hide([incomeEl, allEl]);
    active(expenseBtn);
    inactive([incomeBtn, allBtn]);
});

incomeBtn.addEventListener("click", function(){
    show(incomeEl);
    hide([expenseEl, allEl]);
    active(incomeBtn);
    inactive([expenseBtn, allBtn]);
});

allBtn.addEventListener("click", function(){
    show(allEl);
    hide([incomeEl, expenseEl]);
    active(allBtn);
    inactive([incomeBtn, expenseBtn]);
});

incomeList.addEventListener("click", deleteOrEdit);
expenseList.addEventListener("click", deleteOrEdit);
allList.addEventListener("click", deleteOrEdit);

//ADD EXPENSE
addExpense.addEventListener("click", function(){
    //if one is empty , we exit
    if(!expenseTitle.value || !expenseAmount.value) return;

    //save the entry
    let expense =
    {
        type : "expense",
        title : expenseTitle.value,
        amount: parseInt(expenseAmount.value),
    }
    ENTRY_LIST.push(expense);
    updateUI();
    clearInput([expenseTitle, expenseAmount]);
})

//ADD INCOME
addIncome.addEventListener("click", function(){
    //if one is empty , we exit
    if(!incomeTitle.value || !incomeAmount.value) return;

    //save the entry
    let income =
    {
        type : "income",
        title : incomeTitle.value,
        amount: parseInt(incomeAmount.value),
    }
    ENTRY_LIST.push(income);
    updateUI();
    clearInput([incomeTitle, incomeAmount]);
})



//Helpers
//class functions
function show(element){
    element.classList.remove("hide");
}

function hide(elements){
    elements.forEach(element =>{
        element.classList.add("hide");
    })
}

function active(element){
    element.classList.add("active");
}

function inactive(elements){
    elements.forEach(element =>{
        element.classList.remove("active");
    })
}


//update function
function updateUI(){
    let income = calculateTotal("income", ENTRY_LIST);
    let outcome = calculateTotal("expense", ENTRY_LIST);
    let balance = Math.abs(calculateBalance( income, outcome));

    let sign = (income >= outcome) ? "$" : "-$";

    //update ui
    clearElement([expenseList, incomeList, allList]);
    balanceEl.innerHTML = `<small>${sign}</small>${balance}`;
    incomeTotalEl.innerHTML = `<small>$</small>${income}`;
    outcomeTotalEl.innerHTML = `<small>$</small>${outcome}`;



    ENTRY_LIST.forEach((entry, index) => {
        if( entry.type == "expense"){
            showEntry(expenseList, entry.type, entry.title, entry.amount, index);
        } else if (entry.type == "income"){
            showEntry(incomeList, entry.type, entry.title, entry.amount, index);
        }

        showEntry(allList, entry.type, entry.title, entry.amount, index);
    })

    updateChart(income, outcome);

    localStorage.setItem("entry_list", JSON.stringify(ENTRY_LIST));
}

//input functions
function showEntry(list, type, title, amount, id){

    const entry =`<li id ="${id}" class="${type}">
                    <div class="entry">${title}: $${amount}</div>
                    <div id="edit"></div>
                    <div id="delete"></div>
                </li> `;

    const position = "afterbegin";

    list.insertAdjacentHTML(position, entry);

}



//clear functions

function clearInput(inputs){
    inputs.forEach( input => {
        input.value = "";
    });
}

function clearElement(elements){
    elements.forEach(element => {
        element.innerHTML = " ";
    })
}


//Calculate functions

function calculateTotal(type, list){
    let sum = 0;

    list.forEach(entry => {
        if( entry.type == type ){
            sum += entry.amount;
        }
    })

    return sum;
}

function calculateBalance(income, outcome){
    return income - outcome;
}


//delete or edit function

function deleteOrEdit(event){
    const targetBtn = event.target;

    const entry = targetBtn.parentNode;

    if(targetBtn.id == DELETE ){
        deleteEntry(entry);
    }else if (targetBtn.id == EDIT){
        editEntry(entry);
    }
}

function deleteEntry(entry){
    ENTRY_LIST.splice( entry.id, 1);
    updateUI();
}

function editEntry(entry){
    let ENTRY = ENTRY_LIST[entry.id];

    if (ENTRY.type == "income"){
        incomeAmount.value = ENTRY.amount;
        incomeTitle.value = ENTRY.title;
    }else if (ENTRY.type == "expense"){
        expenseAmount.value = ENTRY.amount;
        expenseTitle.value = ENTRY.title;
    }

    deleteEntry(entry);
}