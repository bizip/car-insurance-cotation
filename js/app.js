//variables
form = document.getElementById('request-quote');
const html = new HTMLUI();

//event listerners
addEventListeners();

function addEventListeners() {
    document.addEventListener('DOMContentLoaded', function() {

        html.displayYears();
    });
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const make = document.getElementById('make').value;
        const year = document.getElementById('year').value;
        const level = document.querySelector('input[name=level]:checked').value;
        if (make === '' || year === '' || level === '') {
            html.displayError('all the field are mendatory');
        } else {
            //clear the previous quotes
            const prevResult = document.querySelector("#result div");
            if (prevResult !== null) {
                prevResult.remove();
            }
            const insurance = new Insurance(make, year, level);
            const price = insurance.calculateQuotation(insurance);
            //print result from html ui
            html.showResults(price, insurance);
        }
    });
}

function Insurance(make, year, level) {
    this.make = make;
    this.year = year;
    this.level = level;
}
//calculate the price for the current Quotation
Insurance.prototype.calculateQuotation = function(insurance) {
    let price;
    const base = 2000;
    const make = insurance.make;
    switch (make) {
        case '1':
            price = base * 1.15;
            break;
        case '2':
            price = base * 1.05;
            break;
        case '3':
            price = base * 1.35;
            break;
    }
    const year = insurance.year;
    const difference = this.getYearDifference(year);

    //each year the cost is going to be 3% cheaper
    price = price - ((difference * 3) * price) / 100;
    //check the level of protection
    const level = insurance.level;
    price = this.calcuratelevel(price, level);
    return price;

}

Insurance.prototype.getYearDifference = function(year) {
    return new Date().getFullYear() - year;

}
Insurance.prototype.calcuratelevel = function(price, level) {
    if (level === 'basic') {
        price = price * 1.30;
    } else {
        price = price * 1.50;
    }
    return price;
}


//objects
function HTMLUI() {}
HTMLUI.prototype.displayYears = function() {
    const max = new Date().getFullYear(),
        min = max - 20;
    //generate list wtith the latest 20 years
    const selectYears = document.getElementById('year');

    for (let i = max; i > min; i--) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        selectYears.appendChild(option);
    }
}

HTMLUI.prototype.displayError = function(message) {
    const div = document.createElement('div');
    div.classList = 'error';
    div.innerHTML = `
    <p>${message}</p>
    `;
    form.insertBefore(div, document.querySelector('.form-group'));
    setTimeout(function() {
        document.querySelector('.error').remove();
    }, 3000)
}
HTMLUI.prototype.showResults = function(price, insurance) {
    const result = document.getElementById('result');
    const div = document.createElement('div');
    let make = insurance.make;
    let year = insurance.year;
    let level = insurance.level;

    switch (make) {
        case '1':
            make = 'American';
            break;
        case '2':
            make = 'Asian';
            break;
        case '3':
            make = 'European';
            break;
    }

    div.innerHTML = `
    <p class='header'>Summary</p>
    <p>Make: ${make}</p>
    <p>Year: ${year}</p>
    <p>Level: ${level}</p>
    
    <p class="total">Total:$ ${price}</p>
    `;

    const spinner = document.querySelector('#loading img');
    spinner.style.display = 'block';
    setTimeout(function() {
        spinner.style.display = 'none';
        result.appendChild(div);
    }, 3000);

}