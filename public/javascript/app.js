const navLinks = document.querySelectorAll('.nav-link:not(#navbarDropdown)');

for (let link of navLinks) {
    if (link.pathname === window.location.pathname) {
        link.classList.add('active', 'disabled');
    }
}
