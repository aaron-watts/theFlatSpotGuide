const form = document.querySelector('form#spot-form');

form.formSubmit.addEventListener('click', () => {
    const validate = () => {
        let validated = true;

        if (!form.name.value) {
            form.name.classList.add('is-invalid');
            validated = false;
        }

        if (!form.location.value) {
            form.location.classList.add('is-invalid');
            validated = false;
        }

        if (!details.value) {
            details.classList.add('is-invalid');
            validated = false;
        }

        return validated;
    }

    if (validate()) form.submit();
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