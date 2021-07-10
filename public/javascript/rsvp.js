const rsvpButtons = document.querySelectorAll('button.rsvp.follow');
const unrsvpButtons = document.querySelectorAll('button.rsvp.unfollow');

for (let button of rsvpButtons) {
    button.addEventListener('click', async function () {
        const removeButton = function (btn) {
            const div = btn.parentElement;
            const badge = document.createElement('BUTTON');
            const content = document.createElement('I');
            content.classList.add('bi', 'bi-bookmark-fill');
            badge.appendChild(content);
            badge.classList.add('btn', 'text-success');
            btn.remove();
            div.appendChild(badge);
        }
        const res = await axios.put(`/events/${this.id}`)
            .then(removeButton(this))
    })
}

for (let button of unrsvpButtons) {
    button.addEventListener('click', async function () {
        const removeButton = function (btn) {
            const div = btn.parentElement;
            const badge = document.createElement('BUTTON');
            const content = document.createElement('I');
            content.classList.add('bi', 'bi-bookmark-fill');
            badge.appendChild(content);
            badge.classList.add('btn', 'text-success');
            btn.remove();
            div.appendChild(badge);
        }
        const res = await axios.patch(`/events/${this.id}`)
            //.then(removeButton(this))
    })
}