//declare calc buttons
let calculator_buttons = [
    {
        name : "delete",
        symbol : "⌫",
        formula : false,
        type : "key"
    },{
        name : "clear",
        symbol : "C",
        formula : false,
        type : "key"
    },{
        name : "percent",
        symbol : "%",
        formula : "/100",
        type : "number"
    },{
        name : "division",
        symbol : "÷",
        formula : "/",
        type : "operator"
    },{
        name : "7",
        symbol : 7,
        formula : 7,
        type : "number"
    },{
        name : "8",
        symbol : 8,
        formula : 8,
        type : "number"
    },{
        name : "9",
        symbol : 9,
        formula : 9,
        type : "number"
    },{
        name : "multiplication",
        symbol : "×",
        formula : "*",
        type : "operator"
    },{
        name : "4",
        symbol : 4,
        formula : 4,
        type : "number"
    },{
        name : "5",
        symbol : 5,
        formula : 5,
        type : "number"
    },{
        name : "6",
        symbol : 6,
        formula : 6,
        type : "number"
    },{
        name : "addition",
        symbol : "+",
        formula : "+",
        type : "operator"
    },,{
        name : "1",
        symbol : 1,
        formula : 1,
        type : "number"
    },{
        name : "2",
        symbol : 2,
        formula : 2,
        type : "number"
    },{
        name : "3",
        symbol : 3,
        formula : 3,
        type : "number"
    },{
        name : "subtraction",
        symbol : "–",
        formula : "-",
        type : "operator"
    },{
        name : "0",
        symbol : 0,
        formula : 0,
        type : "number"
    },{
        name : "comma",
        symbol : ".",
        formula : ".",
        type : "number"
    },{
        name : "calculate",
        symbol : "=",
        formula : "=",
        type : "calculate"
    }
];


//create the elements
const output_result = document.querySelector(".result .value");
const output_operation = document.querySelector(".operation .value");
const input_element = document.querySelector(".input");

//create the buttons for the calculator
function createButtons(){
    const btns_per_row = 4;
    let added_btns = 0;

    calculator_buttons.forEach((button) => {
        //check if it has to create a new row or not.
        if (added_btns % btns_per_row == 0){
            input_element.innerHTML +=
            `<div class="row"></div>`;
        }
        //select the last row created
        let row = document.querySelector(".row:last-child");

        //create the button
        row.innerHTML +=
        `<button id="${button.name}">
            ${button.symbol}
        </button>`;

        //add plus one to the button count..
        added_btns++;

    });
}

//call the function
createButtons();

//add event listener to input field
input_element.addEventListener("click", event => {
   //store the target
   const target_btn = event.target;

   //iterate btns to check which was clicked
   calculator_buttons.forEach((button)=>{
        if(target_btn.id == button.name)
        {
            calculator(button);
        }
   });
});


//save data
let data = {
    operation : [],
    result : [],
};

//calculator function
function calculator(button){
    if (button.type == "number"){
        data.operation.push(button.symbol);
        data.result.push(button.symbol);
    }
    else if (button.type == "operator"){
        data.operation.push(button.symbol);
        data.result.push(button.formula);
    }
    else if(button.type == "key"){
        if(button.name == "clear"){
            data.operation = [];
            data.result = [];
            updateOutputResult(0);
        } else if (button.name == "delete"){
            data.operation.pop();
            data.result.pop();
        }
    }
    else if(button.type == "calculate") {
        let save = data.result.join("");

        data.operation = [];
        data.result = [];

        let result_final;

        //try for errors
        try{
            result_final = eval(save);
        } catch(error) {
                if(error instanceof SyntaxError){
                    result_final = "Syntax Error";
                    updateOutputResult(result_final);
                    return;
                }
            }

         //format the result
         result_final = formatResult(result_final);

         //save the result
         data.operation.push(result_final);
         data.result.push(result_final);

         //update the result
         updateOutputResult(result_final);
         updateOutputOperation(data.operation);

         return;

        //end of calculate type of button
        }
    updateOutputOperation(data.operation.join(''));

    //end of calculator function
    }

//update the outputs fields
function updateOutputOperation(operation){
    output_operation.innerHTML = operation;
}

function updateOutputResult(result){
    output_result.innerHTML = result;
}

//format the result
function formatResult(result){
    const max_output_numbers = 9;
    const output_precision = 5;

    if(digitCount(result) > max_output_numbers){
        //check for float
        if(isFloat(result)){
            const result_int = parseInt(result);
            const int_length = digitCount(result_int);

            if(int_length > max_output_numbers){
                return result.toPrecision(output_precision);
            }
            else {
                const after_decimal = max_output_numbers - int_length;
                return result.toFixed(after_decimal);
            }

        }
    else {
        return result.toPrecision(output_precision);}

    }

    return result;
}



//digit counter function
function digitCount(number){
    return number.toString().length;
}

//isFloat funtion
function isFloat(number){
    return number % 1 != 0;  //return true if modulo of number is not equal to 0, so its a float.
}