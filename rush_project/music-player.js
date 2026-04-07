// YouTube Player Setup
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
var isPlaying = false;

function onYouTubeIframeAPIReady() {
    player = new YT.Player('youtube-player', {
        height: '0',
        width: '0',
        videoId: 'rltHHblIfIg',
        playerVars: {
            'autoplay': 0,
            'controls': 0,
            'loop': 1,
            'playlist': 'rltHHblIfIg'
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    setupMusicControls();
}

function onPlayerStateChange(event) {
    const toggle = document.getElementById('musicToggle');
    const icon = document.getElementById('musicIcon');
    if (event.data === YT.PlayerState.PLAYING) {
        toggle.classList.add('playing');
        icon.classList.remove('fa-play');
        icon.classList.add('fa-pause');
        isPlaying = true;
    } else {
        toggle.classList.remove('playing');
        icon.classList.remove('fa-pause');
        icon.classList.add('fa-play');
        isPlaying = false;
    }
}

function setupMusicControls() {
    const toggle = document.getElementById('musicToggle');
    if (toggle) {
        // Remove existing listener to avoid duplicates
        const newToggle = toggle.cloneNode(true);
        toggle.parentNode.replaceChild(newToggle, toggle);
        
        newToggle.addEventListener('click', () => {
            if (player && player.getPlayerState() === YT.PlayerState.PLAYING) {
                player.pauseVideo();
            } else if (player) {
                player.playVideo();
            }
        });

        // Restore visual state if playing
        if (isPlaying) {
            newToggle.classList.add('playing');
            const icon = newToggle.querySelector('#musicIcon');
            if (icon) {
                icon.classList.remove('fa-play');
                icon.classList.add('fa-pause');
            }
        }
    }
}

// Seamless Navigation (AJAX Router)
document.addEventListener('click', e => {
    const link = e.target.closest('a');
    if (!link || !link.href) return;

    const hrefAttr = link.getAttribute('href') || '';

    // Ignore: anchor-only links (#about, #contact, etc.)
    if (hrefAttr.startsWith('#')) return;

    // Ignore: external links or links opened in new tab
    if (link.target === '_blank') return;

    // Ignore: links to different origins
    try {
        const url = new URL(link.href);
        if (url.origin !== window.location.origin) return;

        // If it has a hash and points to the current page, let browser handle it
        if (url.hash && url.pathname === window.location.pathname) return;

        e.preventDefault();
        navigateTo(link.href);
    } catch (err) {
        // If URL parsing fails, let the browser handle it
    }
});

async function navigateTo(url) {
    try {
        const response = await fetch(url);
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        const newContent = doc.getElementById('app-wrap');
        const currentContent = document.getElementById('app-wrap');
        
        if (newContent && currentContent) {
            // Update URL first
            window.history.pushState(null, '', url);

            // Apply a fade-out effect
            currentContent.style.opacity = '0';
            
            setTimeout(() => {
                // Update page title
                document.title = doc.title;
                
                // Swap the inner content
                currentContent.innerHTML = newContent.innerHTML;
                
                // Update body classes for different page styles (e.g. summary-container)
                document.body.className = doc.body.className;
                
                // Re-setup music controls (button was part of swapped content)
                setupMusicControls();

                // Scroll to top only on full page navigations (not anchor jumps)
                window.scrollTo({ top: 0, behavior: 'instant' });

                // Fade back in
                currentContent.style.opacity = '1';
            }, 300);
        }
    } catch (error) {
        console.error('Navigation failed:', error);
        window.location.href = url; // Fallback to normal load
    }
}

// Handle Back/Forward buttons
window.addEventListener('popstate', () => {
    // Only navigate if the change is not just a hash change
    const url = new URL(window.location.href);
    if (!url.hash) {
        navigateTo(window.location.href);
    }
});

// Set up smooth transition for app-wrap on page load
document.addEventListener('DOMContentLoaded', () => {
    const appWrap = document.getElementById('app-wrap');
    if (appWrap) {
        appWrap.style.transition = 'opacity 0.3s ease';
    }
});
