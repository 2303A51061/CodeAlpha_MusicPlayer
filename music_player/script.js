class MusicPlayer {
    constructor() {
        this.audio = document.getElementById('audio');
        this.currentSongIndex = 0;
        this.isPlaying = false;
        this.isShuffling = false;
        this.isRepeating = false;
        this.autoplay = false;
        
        this.playlist = [
    {
        title: "Chill Vibes",
        artist: "Ambient Artist",
        artwork: "https://images.pexels.com/photos/1540338/pexels-photo-1540338.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    },
    {
        title: "Summer Dreams",
        artist: "Indie Band",
        artwork: "https://images.pexels.com/photos/1644794/pexels-photo-1644794.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
    },
    {
        title: "Night Drive",
        artist: "Electronic Producer",
        artwork: "https://images.pexels.com/photos/1261728/pexels-photo-1261728.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
    },
    {
        title: "Acoustic Soul",
        artist: "Folk Singer",
        artwork: "https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
    },
    {
        title: "Urban Beats",
        artist: "Hip Hop Artist",
        artwork: "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3"
    }
];

        this.initializeElements();
        this.attachEventListeners();
        this.loadCurrentSong();
        this.createPlaylist();
    }
    
    initializeElements() {
        // Player elements
        this.playBtn = document.getElementById('playBtn');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.shuffleBtn = document.getElementById('shuffleBtn');
        this.repeatBtn = document.getElementById('repeatBtn');
        
        // Song info elements
        this.songTitle = document.getElementById('songTitle');
        this.artistName = document.getElementById('artistName');
        this.artwork = document.getElementById('artwork');
        this.playOverlay = document.getElementById('playOverlay');
        this.songArtwork = document.querySelector('.song-artwork');
        
        // Time elements
        this.currentTime = document.getElementById('currentTime');
        this.totalTime = document.getElementById('totalTime');
        
        // Progress elements
        this.progressBar = document.getElementById('progressBar');
        this.progress = document.getElementById('progress');
        this.progressDot = document.getElementById('progressDot');
        
        // Volume elements
        this.volumeSlider = document.getElementById('volumeSlider');
        
        // Playlist elements
        this.playlistBtn = document.getElementById('playlistBtn');
        this.playlistContainer = document.getElementById('playlist');
        this.closePlaylist = document.getElementById('closePlaylist');
        this.playlistItems = document.getElementById('playlistItems');
        
        // Settings elements
        this.autoplayToggle = document.getElementById('autoplayToggle');
    }
    
    attachEventListeners() {
        // Audio events
        this.audio.addEventListener('loadedmetadata', () => this.updateTotalTime());
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('ended', () => this.handleSongEnd());
        
        // Control events
        this.playBtn.addEventListener('click', () => this.togglePlay());
        this.prevBtn.addEventListener('click', () => this.previousSong());
        this.nextBtn.addEventListener('click', () => this.nextSong());
        this.shuffleBtn.addEventListener('click', () => this.toggleShuffle());
        this.repeatBtn.addEventListener('click', () => this.toggleRepeat());
        
        // Progress bar events
        this.progressBar.addEventListener('click', (e) => this.seek(e));
        this.progressBar.addEventListener('mousedown', () => this.isDragging = true);
        this.progressBar.addEventListener('mouseup', () => this.isDragging = false);
        this.progressBar.addEventListener('mousemove', (e) => {
            if (this.isDragging) this.seek(e);
        });
        
        // Volume events
        this.volumeSlider.addEventListener('input', (e) => this.setVolume(e.target.value));
        
        // Playlist events
        this.playlistBtn.addEventListener('click', () => this.togglePlaylist());
        this.closePlaylist.addEventListener('click', () => this.togglePlaylist());
        
        // Artwork click event
        this.songArtwork.addEventListener('click', () => this.togglePlay());
        
        // Settings events
        this.autoplayToggle.addEventListener('change', (e) => {
            this.autoplay = e.target.checked;
        });
        
        // Keyboard events
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
    }
    
    loadCurrentSong() {
        const song = this.playlist[this.currentSongIndex];
        
        this.songTitle.textContent = song.title;
        this.artistName.textContent = song.artist;
        this.artwork.src = song.artwork;
        this.audio.src = song.src;
        
        this.updatePlaylistUI();
    }
    
    togglePlay() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }
    
    play() {
        this.audio.play();
        this.isPlaying = true;
        this.playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        this.playOverlay.innerHTML = '<i class="fas fa-pause"></i>';
        this.songArtwork.classList.add('playing');
    }
    
    pause() {
        this.audio.pause();
        this.isPlaying = false;
        this.playBtn.innerHTML = '<i class="fas fa-play"></i>';
        this.playOverlay.innerHTML = '<i class="fas fa-play"></i>';
        this.songArtwork.classList.remove('playing');
    }
    
    nextSong() {
        if (this.isShuffling) {
            this.currentSongIndex = Math.floor(Math.random() * this.playlist.length);
        } else {
            this.currentSongIndex = (this.currentSongIndex + 1) % this.playlist.length;
        }
        this.loadCurrentSong();
        if (this.isPlaying) {
            this.play();
        }
    }
    
    previousSong() {
        if (this.isShuffling) {
            this.currentSongIndex = Math.floor(Math.random() * this.playlist.length);
        } else {
            this.currentSongIndex = this.currentSongIndex === 0 ? this.playlist.length - 1 : this.currentSongIndex - 1;
        }
        this.loadCurrentSong();
        if (this.isPlaying) {
            this.play();
        }
    }
    
    toggleShuffle() {
        this.isShuffling = !this.isShuffling;
        this.shuffleBtn.classList.toggle('active', this.isShuffling);
    }
    
    toggleRepeat() {
        this.isRepeating = !this.isRepeating;
        this.repeatBtn.classList.toggle('active', this.isRepeating);
    }
    
    handleSongEnd() {
        if (this.isRepeating) {
            this.audio.currentTime = 0;
            this.play();
        } else if (this.autoplay) {
            this.nextSong();
        } else {
            this.pause();
        }
    }
    
    updateProgress() {
        if (this.audio.duration) {
            const progressPercent = (this.audio.currentTime / this.audio.duration) * 100;
            this.progress.style.width = progressPercent + '%';
            this.progressDot.style.left = progressPercent + '%';
            
            this.currentTime.textContent = this.formatTime(this.audio.currentTime);
        }
    }
    
    updateTotalTime() {
        if (this.audio.duration) {
            this.totalTime.textContent = this.formatTime(this.audio.duration);
        }
    }
    
    seek(e) {
        const rect = this.progressBar.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        if (this.audio.duration && isFinite(this.audio.duration)) {
            this.audio.currentTime = percent * this.audio.duration;
        }
    }
    
    setVolume(volume) {
        this.audio.volume = volume / 100;
        
        const volumeIcon = document.querySelector('.volume-icon');
        if (volume == 0) {
            volumeIcon.className = 'fas fa-volume-mute volume-icon';
        } else if (volume < 50) {
            volumeIcon.className = 'fas fa-volume-down volume-icon';
        } else {
            volumeIcon.className = 'fas fa-volume-up volume-icon';
        }
    }
    
    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    
    togglePlaylist() {
        this.playlistContainer.classList.toggle('show');
    }
    
    createPlaylist() {
        this.playlistItems.innerHTML = '';
        
        this.playlist.forEach((song, index) => {
            const playlistItem = document.createElement('div');
            playlistItem.className = 'playlist-item';
            playlistItem.innerHTML = `
                <img src="${song.artwork}" alt="${song.title}">
                <div class="playlist-item-info">
                    <h4>${song.title}</h4>
                    <p>${song.artist}</p>
                </div>
            `;
            
            playlistItem.addEventListener('click', () => {
                this.currentSongIndex = index;
                this.loadCurrentSong();
                this.togglePlaylist();
                if (this.isPlaying) {
                    this.play();
                }
            });
            
            this.playlistItems.appendChild(playlistItem);
        });
    }
    
    updatePlaylistUI() {
        const playlistItems = this.playlistItems.querySelectorAll('.playlist-item');
        playlistItems.forEach((item, index) => {
            item.classList.toggle('active', index === this.currentSongIndex);
        });
    }
    
    handleKeyPress(e) {
        switch(e.code) {
            case 'Space':
                e.preventDefault();
                this.togglePlay();
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.nextSong();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                this.previousSong();
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.setVolume(Math.min(100, this.volumeSlider.value * 1 + 10));
                this.volumeSlider.value = this.audio.volume * 100;
                break;
            case 'ArrowDown':
                e.preventDefault();
                this.setVolume(Math.max(0, this.volumeSlider.value * 1 - 10));
                this.volumeSlider.value = this.audio.volume * 100;
                break;
        }
    }
}

// Initialize the music player when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new MusicPlayer();
});

// Add some helpful console messages for development
console.log('🎵 Music Player Loaded!');
console.log('Keyboard shortcuts:');
console.log('- Space: Play/Pause');
console.log('- Arrow Left: Previous song');
console.log('- Arrow Right: Next song');
console.log('- Arrow Up: Volume up');
console.log('- Arrow Down: Volume down');