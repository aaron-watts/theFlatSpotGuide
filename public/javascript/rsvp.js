const rsvpButtons = document.querySelectorAll('button.rsvp');

for (let button of rsvpButtons) {
    button.addEventListener('click', async function () {
        const removeButton = function (btn) {
            const div = btn.parentElement;
            const badge = document.createElement('SPAN');
            const content = document.createElement('I');
            content.classList.add('bi', 'bi-bookmark-fill', 'py-0');
            badge.appendChild(content);
            badge.classList.add('badge', 'bg-success', 'fs-6');
            btn.remove();
            div.appendChild(badge);
        }
        const res = await axios.put(`/events/${this.id}`)
            .then(removeButton(this))
    })
}