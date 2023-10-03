window.onload = function() {
    var num1 = Math.floor(Math.random() * 100) + 1; // generates a random number from 1 to 100 inclusive
    var num2 = Math.floor(Math.random() * 100) + 1; // generates a random number from 1 to 100 inclusive
    var sum = num1 + num2;
    var elem = document.getElementById('sum');
    
    if(elem){
        elem.innerText = "The sum of " + num1 + " and " + num2 + " is " + sum;
    } else {
        console.log("Element with ID 'sum' not found");
    }
};