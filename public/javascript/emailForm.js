const form = document.querySelector('form');
const emailRegex = /(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;

form.addEventListener('input', () => {
    if (email.value.length && emailRegex.test(email.value)) {
        email.classList.add('is-valid');
        email.classList.remove('is-invalid');
    }
    if (email.value.length && !emailRegex.test(email.value)) {
        email.classList.add('is-invalid');
        email.classList.remove('is-valid');
    }
    if (!email.value.length) {
        email.classList.remove('is-valid');
        email.classList.remove('is-invalid');
    }
})

form.formSubmit.addEventListener('click', () => {
    const validateForm = () => {
        if (!email.value.length) return false;
        if (!emailRegex.test(email.value)) return false;
        return true;
    }

    if (validateForm()) form.submit();
})
