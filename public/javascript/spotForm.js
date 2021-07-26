const form = document.querySelector('form#spot-form');
const loadingModal = document.querySelector('#loading');
const latLonRegex = /^((\-?|\+?)?\d+(\.\d+)?),\s*((\-?|\+?)?\d+(\.\d+)?)$/;

form.formSubmit.addEventListener('click', () => {
    const validate = () => {
        let validated = true;

        const checkNotBlank = (element) => {
            if (!element.value) {
                element.classList.add('is-invalid');
                validated = false;
            }
        }

        checkNotBlank(form.name);
        checkNotBlank(form.location);
        checkNotBlank(details);

        if (form.action.includes('/spots/') && coordinates.value.length &&
            !latLonRegex.test(coordinates.value)) {
            coordinates.classList.add('is-invalid');
            validated = false;
        }

        // If new spot form and 1 or 2 files only
        if (!form.action.includes('/spots/') && (!image.files.length || image.files.length > 2)) {
            image.classList.add('is-invalid');
            validated = false;
        }

        // If edit form only allow 2 images including previously uploaded
        if (form.action.includes('/spots/') && image.files.length > 2 - imageCount) {
            image.classList.add('is-invalid');
            validated = false;
        }

        //return validated;
        return false;
    }

    if (validate()) {
        loadingModal.classList.remove('d-none');
        form.submit()
    };
})

const checkNotBlank = (input) => {
    if (input.value.length) {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
    } else {
        input.classList.add('is-invalid');
        input.classList.remove('is-valid');
    }
}

const testCoordinates = (input) => {
    if (input.value.length && !latLonRegex.test(input.value)) {
        input.classList.add('is-invalid');
        input.classList.remove('is-valid');
    } 
    if (input.value.length && latLonRegex.test(input.value)) {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
    }
    if (!input.value.length) input.classList.remove('is-valid','is-invalid');
}

form.addEventListener('input', (evt) => {
    if (evt.target.id !== 'coordinates') checkNotBlank(evt.target);
    else testCoordinates(evt.target);
})