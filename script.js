document.addEventListener('keydown', function(event) {
    // Check if the user pressed 'h' or 'H'
    // Ignore if typing inside an input field or textarea
    if (event.key.toLowerCase() === 'h' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        const hub = document.getElementById('hub');
        const contentWrapper = document.querySelector('.content-wrapper');
        
        hub.classList.toggle('active');
        contentWrapper.classList.toggle('hub-open');
    }
});