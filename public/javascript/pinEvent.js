const eventBtn = document.querySelector('#open-event-form');
        const eventForm = document.querySelector('#new-event');

        eventBtn.addEventListener('click', (e) => {
            e.preventDefault();
            //eventForm.classList.toggle('d-none');
            eventBtn.classList.toggle('btn-primary');
            eventBtn.classList.toggle('btn-danger');
            if (eventBtn.innerHTML === 'Cancel') {
                eventBtn.innerHTML = '<i class="bi bi-pin-angle"></i> Pin Event';
            } else eventBtn.innerHTML = 'Cancel'
        })