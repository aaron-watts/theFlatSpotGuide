const form = document.querySelector('form');
const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/;
const emailRegex = /(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;

const checkUsername = async function (evt) {
    // if username not blank check if username is free
    if (this.value.length) {
        const res = await axios.get(`/users/${this.value}`, {});
        
        const userExists = res.data.exists;
    
        if (userExists) {
            this.classList.add('is-invalid');
            this.classList.remove('is-valid');
            this.nextElementSibling.classList.remove('d-none');
        } 
        if (!userExists) {
            this.classList.remove('is-invalid');
            this.classList.add('is-valid');
            this.nextElementSibling.classList.add('d-none');
        }
    } else {
        this.classList.remove('is-invalid', 'is-valid');
        this.nextElementSibling.classList.remove('d-none');
    }
}

form.formSubmit.addEventListener('click', (evt) => {
    evt.preventDefault();

    const validateForm = () => {
        if (!email.value.length || !emailRegex.test(email.value)) return false;
        if (!username.value.length || username.classList.contains('is-invalid')) return false;
        if (!password.value.length || !passwordRegex.test(password.value)) return false;
        if (password.value !== confirmPassword.value) return false;
        return true;
    }

    if (validateForm()) form.submit();
})

form.username.addEventListener('change', checkUsername);

form.addEventListener('input', () => {
    if (password.value.length && !passwordRegex.test(password.value)) {
        password.classList.add('is-invalid');
        password.classList.remove('is-valid');
    }

    if (passwordRegex.test(password.value)) {
        password.classList.remove('is-invalid');
        password.classList.add('is-valid');
    }

    if (!password.value.length) {
        password.classList.remove('is-invlaid');
        password.classList.remove('is-valid');
    }

    if (password.value.length && confirmPassword.value.length && 
    password.value !== confirmPassword.value) {
        confirmPassword.classList.add('is-invalid');
        confirmPassword.classList.remove('is-valid');
        confirmPassword.nextElementSibling.classList.remove('d-none');
    }

    if (password.value.length && confirmPassword.value.length && 
        password.value === confirmPassword.value) {
            confirmPassword.classList.add('is-valid');
            confirmPassword.classList.remove('is-invalid');
            confirmPassword.nextElementSibling.classList.add('d-none');
    }

    if (email.value.length && emailRegex.test(email.value)) {
        email.classList.remove('is-invalid');
        email.classList.add('is-valid');
    }

    if (email.value.length && !emailRegex.test(email.value)) {
        email.classList.add('is-invalid');
        email.classList.remove('is-valid');
    }

    if (!email.value.length) {
        email.classList.remove('is-invalid');
        email.classList.remove('is-valid');
    }
})