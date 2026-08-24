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

document.addEventListener('DOMContentLoaded', () => {
    const avatarContainer = document.querySelector('.walking-avatar-container');
    if (!avatarContainer) return;

    // Initialize position variables based on current layout
    const initialRect = avatarContainer.getBoundingClientRect();
    let currentLeft = initialRect.left;
    let currentBottom = window.innerHeight - initialRect.bottom;

    avatarContainer.style.position = 'fixed';
    avatarContainer.style.left = `${currentLeft}px`;
    avatarContainer.style.bottom = `${currentBottom}px`;
    avatarContainer.style.top = 'auto';

    let direction = 1; // 1 for walking right, -1 for walking left
    let speed = 1.2;   // Walking speed in pixels per frame
    let isDragging = false;
    let startX, startY;
    let initialMouseLeft, initialMouseBottom;

    // Continuous walking loop
    function walkLoop() {
        if (!isDragging) {
            currentLeft += speed * direction;

            const maxLeft = window.innerWidth - avatarContainer.offsetWidth - 20;
            const minLeft = 20;

            // Bounce back when hitting screen edges
            if (currentLeft >= maxLeft) {
                currentLeft = maxLeft;
                direction = -1;
            } else if (currentLeft <= minLeft) {
                currentLeft = minLeft;
                direction = 1;
            }

            avatarContainer.style.left = `${currentLeft}px`;
            // Flip sprite direction depending on walk direction
            avatarContainer.style.transform = `scaleX(${direction === 1 ? 1 : -1})`;
        }
        requestAnimationFrame(walkLoop);
    }
    requestAnimationFrame(walkLoop);

    // Drag-and-Drop Listeners
    avatarContainer.addEventListener('mousedown', startDrag);
    avatarContainer.addEventListener('touchstart', startDrag, { passive: false });

    function startDrag(e) {
        isDragging = true;
        
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        startX = clientX;
        startY = clientY;
        
        const rect = avatarContainer.getBoundingClientRect();
        initialMouseLeft = rect.left;
        initialMouseBottom = window.innerHeight - rect.bottom;

        document.addEventListener('mousemove', onDrag);
        document.addEventListener('mouseup', stopDrag);
        document.addEventListener('touchmove', onDrag, { passive: false });
        document.addEventListener('touchend', stopDrag);

        e.preventDefault();
    }

    function onDrag(e) {
        if (!isDragging) return;

        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        const dx = clientX - startX;
        const dy = clientY - startY;

        currentLeft = initialMouseLeft + dx;
        currentBottom = initialMouseBottom - dy;

        // Keep him within screen bounds while dragging
        currentLeft = Math.max(0, Math.min(window.innerWidth - avatarContainer.offsetWidth, currentLeft));
        currentBottom = Math.max(0, Math.min(window.innerHeight - avatarContainer.offsetHeight, currentBottom));

        avatarContainer.style.left = `${currentLeft}px`;
        avatarContainer.style.bottom = `${currentBottom}px`;

        e.preventDefault();
    }

    function stopDrag() {
        if (!isDragging) return;
        isDragging = false;

        document.removeEventListener('mousemove', onDrag);
        document.removeEventListener('mouseup', stopDrag);
        document.removeEventListener('touchmove', onDrag);
        document.removeEventListener('touchend', stopDrag);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const muteBtn = document.getElementById('mute-btn');
    if (!muteBtn) return;

    let isMuted = localStorage.getItem('portfolio_is_muted') === 'true';

    function updateMuteState(muted) {
        const mediaElements = document.querySelectorAll('audio, video');
        mediaElements.forEach(media => {
            media.muted = muted;
        });

        muteBtn.style.opacity = muted ? '0.5' : '1.0';
    }

    updateMuteState(isMuted);

    muteBtn.addEventListener('click', () => {
        isMuted = !isMuted;

        localStorage.setItem('portfolio_is_muted', isMuted);
        
        updateMuteState(isMuted);
    });
});