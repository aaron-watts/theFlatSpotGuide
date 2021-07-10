const rsvpButtons = document.querySelectorAll('button.follow-event');
const unrsvpButtons = document.querySelectorAll('button.unfollow-event');

const follow = async function () {
    console.log('follow')
    const removeButton = function (btn) {
        const newBtn = document.createElement('BUTTON');
        newBtn.classList.add('btn', 'text-success', 'btn-sm','unfollow-event');
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
        newBtn.classList.add('btn', 'text-secondary', 'btn-sm', 'follow-event');
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