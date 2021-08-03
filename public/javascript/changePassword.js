const form = document.querySelector('form');
const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/;

form.formSubmit.addEventListener('click', () => {
    const validateForm = () => {
        if (!oldPassword.value.length) return false;
        if (!newPassword.value.length || !passwordRegex.test(newPassword.value)) return false;
        if (!confirmPassword.value.length || confirmPassword.value !== newPassword.value) return false;
        return true;
    }

    if (validateForm()) form.submit();
    else console.log('Not so fast!')
})

form.addEventListener('input', () => {
    if (newPassword.value.length && !passwordRegex.test(newPassword.value)) {
        newPassword.classList.add('is-invalid');
        newPassword.classList.remove('is-valid');
    }
    if (newPassword.value.length && passwordRegex.test(newPassword.value)) {
        newPassword.classList.remove('is-invalid');
        newPassword.classList.add('is-valid');
    }
    if (!newPassword.value.length) {
        newPassword.classList.remove('is-invalid');
        newPassword.classList.remove('is-valid');
    }

    if (confirmPassword.value.length && confirmPassword.value !== newPassword.value) {
        confirmPassword.classList.add('is-invalid');
        confirmPassword.classList.remove('is-valid');
        confirmPassword.nextElementSibling.classList.remove('d-none');
    }
    if (confirmPassword.value.length && confirmPassword.value === newPassword.value) {
        confirmPassword.classList.remove('is-invalid');
        confirmPassword.classList.add('is-valid');
        confirmPassword.nextElementSibling.classList.add('d-none');
    }
    if (!confirmPassword.value.length) {
        confirmPassword.classList.remove('is-invalid');
        confirmPassword.classList.remove('is-valid');
        confirmPassword.nextElementSibling.classList.add('d-none');
    }
})