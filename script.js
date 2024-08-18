document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('audio');
    const playPauseButton = document.getElementById('play-pause');
    const prevButton = document.getElementById('prev');
    const nextButton = document.getElementById('next');
    const progressBar = document.getElementById('progress-bar');
    const volumeControl = document.getElementById('volume');
    const currentTimeDisplay = document.getElementById('current-time');
    const totalTimeDisplay = document.getElementById('total-time');
    const playlist = document.getElementById('playlist');
    const searchBar = document.getElementById('search-bar');
    const trackImage = document.getElementById('track-image');

    let isPlaying = false;
    const tracks = [
        { src: 'track1.mp3', title: 'First Song', artist: 'John Lennon', image: 'img/2.webp' },
        { src: 'track2.mp3', title: 'Second Song', artist: 'John Lennon', image: 'img/3.avif' }
    ];
    let currentTrackIndex = 0;

    function loadTrack(index) {
        const track = tracks[index];
        audio.src = track.src;
        document.getElementById('track-title').textContent = track.title;
        document.getElementById('artist-name').textContent = track.artist;
        
        // Ensure the image URL is correct
        trackImage.src = track.image;
        trackImage.onload = () => {
            console.log('Image loaded successfully');
        };
        trackImage.onerror = () => {
            console.error('Error loading image:', track.image);
        };

        loadPlaylist();
    }

    function loadPlaylist() {
        playlist.innerHTML = tracks.map((track, index) => `
            <li data-index="${index}">${track.title} - ${track.artist}</li>
        `).join('');
    }

    function updateProgress() {
        const progress = (audio.currentTime / audio.duration) * 100;
        progressBar.value = progress;
        currentTimeDisplay.textContent = formatTime(audio.currentTime);
        totalTimeDisplay.textContent = formatTime(audio.duration);
    }

    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    function filterTracks(query) {
        const items = playlist.querySelectorAll('li');
        items.forEach(item => {
            const title = item.textContent.toLowerCase();
            item.style.display = title.includes(query.toLowerCase()) ? 'block' : 'none';
        });
    }

    playPauseButton.addEventListener('click', () => {
        if (isPlaying) {
            audio.pause();
            playPauseButton.textContent = '▶';
        } else {
            audio.play();
            playPauseButton.textContent = '⏸';
        }
        isPlaying = !isPlaying;
    });

    prevButton.addEventListener('click', () => {
        currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
        loadTrack(currentTrackIndex);
        audio.play();
        playPauseButton.textContent = '⏸';
        isPlaying = true;
    });

    nextButton.addEventListener('click', () => {
        currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
        loadTrack(currentTrackIndex);
        audio.play();
        playPauseButton.textContent = '⏸';
        isPlaying = true;
    });

    progressBar.addEventListener('input', () => {
        audio.currentTime = (progressBar.value / 100) * audio.duration;
    });

    volumeControl.addEventListener('input', () => {
        audio.volume = volumeControl.value;
    });

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', () => {
        nextButton.click();
    });

    playlist.addEventListener('click', (event) => {
        if (event.target.tagName === 'LI') {
            currentTrackIndex = parseInt(event.target.getAttribute('data-index'), 10);
            loadTrack(currentTrackIndex);
            audio.play();
            playPauseButton.textContent = '⏸';
            isPlaying = true;
        }
    });

    searchBar.addEventListener('input', (event) => {
        filterTracks(event.target.value);
    });

    // Load the first track
    loadTrack(currentTrackIndex);
});
