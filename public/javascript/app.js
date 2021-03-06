const navLinks = document.querySelectorAll('.nav-link:not(#navbarDropdown).nav-link:not(.js-ignore)');
const notificationButtons = document.querySelectorAll('.notification-button');
const clearNotifications = document.querySelector('#clear-notifications');
const notificationList = document.querySelector('#notification-list');

let notifications = document.querySelectorAll('.notification');
let notificationsOpen = false;

const removeBadge = () => {
    for (button of notificationButtons) {
        if (button.children[1]) button.children[1].remove();
    }
}

const markAsSeen = async function (evt) {
    evt.preventDefault();

    if(!notificationsOpen) {
        await axios.patch('/notifications');
        notificationsOpen = true;
    } else {
        for (let notification of notifications) notification.classList.add('text-muted');
        removeBadge();
    }
}

const deleteNotifications = async function(evt) {
    evt.preventDefault;

    const removeFromDom = () => {
        for (notification of notifications) {
            clearNotifications.classList.remove('hoverable', 'text-primary');
            clearNotifications.classList.add('text-muted')
            notification.previousElementSibling.remove();
            notification.remove();
        }

        const horizontalRule = document.createElement('LI');
        const divider = document.createElement('HR');
        divider.classList.add('dropdown-divider');
        horizontalRule.appendChild(divider);
        const listItem = document.createElement('LI');
        listItem.classList.add('px-2', 'text-muted');
        listItem.innerText = 'No new notifications';
        
        notificationList.appendChild(horizontalRule);
        notificationList.appendChild(listItem);
    }

    notifications = document.querySelectorAll('.notification');

    if (notifications.length) {
        const res = await axios.delete('/notifications');
        
        if (res.data) {
            removeFromDom();
        }
    }

    removeBadge();
}

for (let link of navLinks) {
    if (link.pathname === window.location.pathname 
        && window.location.search.slice(1,7) !== 'author') {
        link.classList.add('active');
    }
}

for (let button of notificationButtons) {
    button.addEventListener('click', markAsSeen)
}

clearNotifications.addEventListener('click', deleteNotifications)