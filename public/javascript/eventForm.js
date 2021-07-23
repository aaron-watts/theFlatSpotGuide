const form = document.querySelector('form#events-form');
const datetime = ['day', 'month', 'year', 'hours', 'minutes'];

const checkNotBlank = (input) => {
    if (input.value.length) {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
    } else {
        input.classList.add('is-invalid');
        input.classList.remove('is-valid');
    }
}

const numberInputMaxLength = (target) => {
    if (target.id === 'year') target.value = target.value.slice(0, 4);
    else target.value = target.value.slice(0, 2);
}

const spotValid = (spot) => {
    const feedback = document.querySelector('#spot-feedback');
    if (spot.value && spots.some(i => i === spot.value)) {
        spot.classList.remove('is-invalid'); 
        spot.classList.add('is-valid'); 
        feedback.classList.add('d-none');
        spot.parentElement.classList.add('mb-3');
        spot.parentElement.classList.remove('mb-5');
        return true;
    } else {
        spot.classList.add('is-invalid'); 
        spot.classList.remove('is-valid');  
        feedback.classList.remove('d-none');
        spot.parentElement.classList.remove('mb-3');
        spot.parentElement.classList.add('mb-5');
        return false;
    }
}

const dateHandler = () => {
    const today = new Date();
    const mm = month.value || '0';

    const blinkInput = (element) => {
        element.classList.add('blink');
        setTimeout(() => { element.classList.remove('blink') }, 300);
    }

    // don't allow more days in a month than there actually are
    const daysInMonth = (month, year = new Date().getFullYear()) => {
        return new Date(year, month, 0).getDate();
    }

    // if full date is in the past, adjust year to put it into the future
    const backToTheFuture = (dd, mm, yyyy = new Date().getFullYear()) => {
        if (new Date(yyyy, mm, dd) - new Date() < 0) {
            if (new Date(new Date().getFullYear(), mm, dd) - new Date() > 0) {
                year.value = (new Date().getFullYear()).toString();
            }
            else year.value = (new Date().getFullYear() + 1).toString();

            blinkInput(year);
        }
    }

    // limit months to 12
    if (parseInt(month.value) && parseInt(month.value) > 12) {
        month.value = '12';
        blinkInput(month);
    }

    // can't be more than 31 days
    if (!parseInt(month.value) && parseInt(day.value) > 31) {
        day.value = '31';
        blinkInput(day);
    }

    // if the month has less than 31 days then adjust to correct max
    if (!parseInt(year.value) && parseInt(month.value)
        && parseInt(day.value) > daysInMonth(parseInt(month.value))) {
        day.value = daysInMonth(parseInt(month.value)).toString();
        blinkInput(day);
    }

    // account for leap years and february 28/29
    if (parseInt(year.value) && parseInt(month.value)
        && parseInt(day.value) > daysInMonth(parseInt(month.value), parseInt(year.value))) {
        day.value = daysInMonth(parseInt(month.value), parseInt(year.value)).toString();
        blinkInput(day);
    }

    // dates must be upcoming
    if (parseInt(year.value) && parseInt(day.value) && parseInt(month.value)) {
        backToTheFuture(parseInt(day.value), parseInt(month.value) - 1, parseInt(year.value));
    }

    // limit time to 24 hour clock
    if (parseInt(hours.value) > 23) {
        hours.value = '23';
        blinkInput(hours);
    }
    if (parseInt(minutes.value) > 59) {
        minutes.value = '59';
        blinkInput(minutes);
    }
}

form.formSubmit.addEventListener('click', () => {
    const validateForm = () => {
        let validated = true;

        // title not blank
        if (!title.value) {
            title.classList.add('is-invalid');
            validated = false;
        }

        // if spot exists as a form input check spot is a listed location
        if (!(!form.spot) && !spotValid(spot)) {
            form.spot.classList.add('is-invalid');
            validated = false;
        }

        // date is in the future
        if (new Date(
            parseInt(year.value),
            parseInt(month.value),
            parseInt(day.value)
        ) - new Date() < 0) {
            validated = false;
        }
        // description not blank
        if (!description.value) {
            description.classList.add('is-invalid')
            validated = false;
        }

        return validated;
    }  

    if(validateForm()) form.submit();
})

form.addEventListener('change', (evt) => {
    // extend year if yy format is used
    if (year.value.length == 2) year.value = '20' + year.value

    // adjust dates to be realistic
    if (datetime.includes(evt.target.id)) dateHandler();
})

form.addEventListener('input', (evt) => {
    // concatenate lengths
    if (datetime.includes(evt.target.id)) numberInputMaxLength(evt.target);
    // check spot is valid
    else if (evt.target === spot) {
        spotValid(evt.target);
    }
    // check not blank
    else checkNotBlank(evt.target);
})