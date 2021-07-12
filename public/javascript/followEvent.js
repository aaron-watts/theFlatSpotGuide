const followEventButtons = document.querySelectorAll('button.follow-event');

const follow = async function (evt) {
    evt.preventDefault();    
    const res = await axios.patch(`/events/${this.id}`);
    const icon = this.children[0];
    const follows = document.querySelector(`#following${this.id}`);
    
    if (res.data.following) {
        this.classList.remove('text-muted');
        this.classList.add('text-success');
        icon.classList.remove('bi-bookmark');
        icon.classList.add('bi-bookmark-fill');
    } else {
        this.classList.remove('text-success');
        this.classList.add('text-muted');
        icon.classList.remove('bi-bookmark-fill');
        icon.classList.add('bi-bookmark');
    }
    
    follows.innerText = res.data.total;
}

for (let button of followEventButtons) {
    button.addEventListener('click', follow)
}