const form = document.querySelector('form');
const passwordRegex =  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/;

const checkUsername = async function (evt) {
    // if username not blank check if username is free
    if (this.value.length) {
        const res = await axios.get(`/users/${this.value}`, {});
        
        console.log(res.data.exists);

        const userExists = res.data.exists;
    
        if (userExists) {
            this.classList.add('is-invalid');
            this.classList.remove('is-valid');
        } 
        if (!userExists) {
            this.classList.remove('is-invalid');
            this.classList.add('is-valid');
        }
    } else {
        this.classList.remove('is-invalid', 'is-valid');
    }
}

form.formSubmit.addEventListener('click', (evt) => {
    if (password.value.length && !passwordRegex.test(password.value)) {
        password.classList.add('is-invalid');
    }
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
})