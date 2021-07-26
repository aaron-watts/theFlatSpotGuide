const form = document.querySelector('form#spot-form');
const loadingModal = document.querySelector('#loading');

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

        return validated;
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

form.addEventListener('input', (evt) => {
    checkNotBlank(evt.target);
})