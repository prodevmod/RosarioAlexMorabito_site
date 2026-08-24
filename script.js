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

document.addEventListener('DOMContentLoaded', () => {
    const defaultOpinions = [
        { name: "Alex R.", text: "Super cool retro layout! Love the pixel card styling." },
        { name: "DevGuy99", text: "The audio player and walking avatar are top-tier additions." },
        { name: "Anonymous", text: "Clean structure and awesome attention to pixel detail." }
    ];

    // Load saved opinions from localStorage or load defaults
    let opinions = JSON.parse(localStorage.getItem('portfolio_opinions')) || defaultOpinions;
    let currentIndex = 0;
    let autoCycleTimer = null;

    const opinionText = document.getElementById('opinion-text');
    const opinionAuthor = document.getElementById('opinion-author');
    const prevBtn = document.getElementById('prev-opinion-btn');
    const skipBtn = document.getElementById('skip-opinion-btn');
    const form = document.getElementById('opinion-form');
    const nameInput = document.getElementById('opinion-name');
    const messageInput = document.getElementById('opinion-message');

    function displayOpinion(index) {
        if (!opinionText || !opinions.length) return;
        const op = opinions[index];
        opinionText.textContent = `"${op.text}"`;
        opinionAuthor.textContent = `- ${op.name}`;
    }

    function nextOpinion() {
        currentIndex = (currentIndex + 1) % opinions.length;
        displayOpinion(currentIndex);
    }

    function prevOpinion() {
        currentIndex = (currentIndex - 1 + opinions.length) % opinions.length;
        displayOpinion(currentIndex);
    }

    function startAutoCycle() {
        stopAutoCycle();
        autoCycleTimer = setInterval(nextOpinion, 5000); // Cycles every 5 seconds
    }

    function stopAutoCycle() {
        if (autoCycleTimer) {
            clearInterval(autoCycleTimer);
        }
    }

    if (opinionText && prevBtn && skipBtn) {
        displayOpinion(currentIndex);
        startAutoCycle();

        // Manual override: Go back and restart timer
        prevBtn.addEventListener('click', () => {
            prevOpinion();
            startAutoCycle();
        });

        // Manual override: Skip forward and restart timer
        skipBtn.addEventListener('click', () => {
            nextOpinion();
            startAutoCycle();
        });
    }

    // Handle user submissions
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const newOp = {
                name: nameInput.value.trim() || "Anonymous",
                text: messageInput.value.trim()
            };

            opinions.push(newOp);
            localStorage.setItem('portfolio_opinions', JSON.stringify(opinions));

            // Jump straight to the user's newly added opinion
            currentIndex = opinions.length - 1;
            displayOpinion(currentIndex);

            // Reset form inputs
            nameInput.value = '';
            messageInput.value = '';
            startAutoCycle();
        });
    }
});

/* ==========================================
   GLOBAL BROKEN IMAGE HIDER
   ========================================== */
document.addEventListener('error', (event) => {
    // Check if the element that failed to load is an image
    if (event.target && event.target.tagName === 'IMG') {
        event.target.style.display = 'none';
        
        // Optional: If you also want to hide the parent container card 
        // if an API graph or logo completely fails to fetch:
        // const parentCard = event.target.closest('.stat-card');
        // if (parentCard && event.target.classList.contains('api-graph-img')) {
        //     parentCard.style.display = 'none';
        // }
    }
}, true);