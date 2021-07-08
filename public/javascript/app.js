const navLinks = document.querySelectorAll('.nav-link');

for (let link of navLinks) {
    if (link.pathname === window.location.pathname) {
        link.classList.add('active', 'disabled');
    }
}
