const rsvpButtons = document.querySelectorAll('button.rsvp.follow');
const unrsvpButtons = document.querySelectorAll('button.rsvp.unfollow');

const follow = async function () {
    console.log('follow')
    const removeButton = function (btn) {
        const newBtn = document.createElement('BUTTON');
        newBtn.classList.add('btn', 'text-success', 'btn-sm', 'rsvp', 'unfollow');
        newBtn.id = btn.id;         
        const content = document.createElement('I');
        content.classList.add('bi', 'bi-bookmark-fill');
        newBtn.appendChild(content);
        newBtn.addEventListener('click', unfollow)
        btn.parentElement.appendChild(newBtn)
        btn.remove();
    }
    const res = await axios.put(`/events/${this.id}`)
        .then(removeButton(this))
}

const unfollow = async function () {
    console.log('unfollow');
    const removeButton = function (btn) {
        const newBtn = document.createElement('BUTTON');
        newBtn.classList.add('btn', 'text-secondary', 'btn-sm', 'rsvp', 'follow');
        newBtn.id = btn.id;     
        const content = document.createElement('I');
        content.classList.add('bi', 'bi-bookmark-fill');
        newBtn.appendChild(content);
        newBtn.addEventListener('click', follow)
        btn.parentElement.appendChild(newBtn)
        btn.remove();
    }
    const res = await axios.patch(`/events/${this.id}`)
        .then(removeButton(this))
}

for (let button of rsvpButtons) {
    button.addEventListener('click', follow)
}

for (let button of unrsvpButtons) {
    button.addEventListener('click', unfollow)
}