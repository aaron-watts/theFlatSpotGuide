const followButtons = document.querySelectorAll('button.follow-spot');


const follow = async function (evt) {
    evt.preventDefault();    
    const res = await axios.patch(`/spots/${this.id}`)
    
    console.log(res.data);
    if (res.data) {
        this.classList.remove('text-secondary');
        this.classList.add('text-success');
    } else {
        this.classList.remove('text-success');
        this.classList.add('text-secondary');
    }
}

for (let button of followButtons) {
    button.addEventListener('click', follow)
}