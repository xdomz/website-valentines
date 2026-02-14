const envelope = document.querySelector('.envelope');
const letter = document.querySelector('.letter');
const body = document.body;

const ticketAsset = document.querySelector('.ticket-asset');
const ticketOverlay = document.getElementById('ticket-overlay');
const roseAsset = document.querySelector('.rose-asset');
const roseOverlay = document.getElementById('rose-overlay');
const zoomedBouquet = document.querySelector('.zoomed-bouquet');
const herAsset = document.querySelector('.her-asset');
const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
// Open Bouquet View
roseAsset.addEventListener('click', (e) => {
    // Only allow clicking the rose if the envelope is open
    if (envelope.classList.contains('open')) {
        roseOverlay.classList.add('active');
    }
    e.stopPropagation(); // Don't close the envelope
});

// Close Bouquet View (Click anywhere on the pink screen)
// When clicking anywhere on the overlay or the bouquet itself
roseOverlay.addEventListener('click', () => {
    // Remove the active class to trigger the CSS fade/scale out
    roseOverlay.classList.remove('active');
});

const audio = new Audio('songs/always.mp3');
audio.loop = true; 
audio.volume = 0.3;
const volumeSlider = document.getElementById('volume-slider');
const muteBtn = document.getElementById('mute-btn');
let lastVolume = 0.3;

// Function to update icon based on volume level
function updateVolumeIcon(val) {
    if (val == 0) {
        muteBtn.textContent = '🔇';
    } else if (val < 0.5) {
        muteBtn.textContent = '🔉';
    } else {
        muteBtn.textContent = '🔊';
    }
}

// Slider logic
volumeSlider.addEventListener('input', (e) => {
    const val = e.target.value;
    audio.volume = val;
    updateVolumeIcon(val);
    if (val > 0) lastVolume = val; // Save the volume if it's not muted
});

// Clickable Mute Button logic
muteBtn.addEventListener('click', () => {
    if (audio.volume > 0) {
        lastVolume = audio.volume; // Remember current volume
        audio.volume = 0;
        volumeSlider.value = 0;
    } else {
        audio.volume = lastVolume; // Restore to last known volume
        volumeSlider.value = lastVolume;
    }
    updateVolumeIcon(audio.volume);
});

envelope.addEventListener('click', (e) => {
    // If the letter is zoomed, don't let the envelope click close things
    if (letter.classList.contains('zoomed')) return;

    if (!envelope.classList.contains('open')) {
        // OPEN ENVELOPE
        envelope.classList.add('open');
        body.classList.add('envelope-is-open');
        audio.play().catch(err => console.log("Click again for audio"));
    } else {
        // CLOSE ENVELOPE (Only if not zoomed)
        envelope.classList.remove('open');
        body.classList.remove('envelope-is-open');
        audio.pause();
        audio.currentTime = 0;
    }
    e.stopPropagation();
});

letter.addEventListener('click', (e) => {
    if (envelope.classList.contains('open')) {
        if (!letter.classList.contains('zoomed')) {
            // STAGE 1 -> 2: Zoom In
            letter.classList.add('zoomed');
        } else {
            // STAGE 2 -> 1: Zoom Out back to pocket
            letter.classList.remove('zoomed');
        }
    }
    // Prevent closing the envelope when clicking the letter
    e.stopPropagation();
});



// Open Ticket View
ticketAsset.addEventListener('click', (e) => {
    if (envelope.classList.contains('open')) {
        ticketOverlay.classList.add('active');
    }
    e.stopPropagation();
});

// Close Ticket View
ticketOverlay.addEventListener('click', () => {
    ticketOverlay.classList.remove('active');
});


yesBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevents the overlay from closing instantly
    
    // Update the text for a sweet moment before redirecting
    document.querySelector('.ticket-text').innerHTML = "YAY! IT'S A DATE! ❤️✨";
    document.querySelector('.ticket-buttons').style.display = 'none';

    // Redirect to your Discord Profile after 1.5 seconds
    setTimeout(() => {
        window.open('https://discordapp.com/users/883950098172739594', '_blank');
    }, 1500);
});

let moveUpAmount = 0;
let yesScale = 1;

noBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    
    // 1. Move the Yes button "Up" (adjusting the X or Y based on your rotation)
    // Since the ticket is rotated 90deg, moving "Up" usually means decreasing TranslateX
    moveUpAmount -= 5; 
    yesScale += 0.15; // Make it 15% bigger each time
    
    yesBtn.style.transform = `translateX(${moveUpAmount}px) scale(${yesScale})`;
    
    // 2. Change the 'No' button text to be more desperate
    const phrases = ["Rude! 😤", "Try again lol", "Click the big one!", "Wrong choice!"];
    noBtn.innerText = phrases[Math.floor(Math.random() * phrases.length)];
    
    // 3. Optional: Make the 'No' button smaller so it's harder to hit
    noBtn.style.transform = `scale(${1 / yesScale})`; 
});