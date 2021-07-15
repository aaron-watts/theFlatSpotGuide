
const navLinks = document.querySelectorAll('.nav-link:not(#navbarDropdown)');
const notificationButtons = document.querySelectorAll('.notification-button');
const notifications = document.querySelectorAll('.notification');
let notificationsOpen = false;

for (let link of navLinks) {
    if (link.pathname === window.location.pathname) {
        link.classList.add('active', 'disabled');
    }
}

const markAsSeen = async function (evt) {
    evt.preventDefault();

    if(!notificationsOpen) {
        await axios.patch('/notifications');
        notificationsOpen = true;
    } else {
        for (let notification of notifications) notification.classList.add('text-muted');
        for (button of notificationButtons) {
            if (button.children[1]) button.children[1].remove();
        }
    }
}

for (let button of notificationButtons) {
    button.addEventListener('click', markAsSeen)
}