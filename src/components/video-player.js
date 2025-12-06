/**
 * Video Player Component
 * 
 * Custom video player with comprehensive controls, accessibility features,
 * and robust error handling. Supports play/pause, progress tracking,
 * fullscreen mode, keyboard navigation, and loading states.
 * 
 * @generated-from: task-id:TASK-005
 * @modifies: src/components/demo-section.js
 * @dependencies: []
 */

/**
 * Video player state
 * @typedef {Object} VideoPlayerState
 * @property {boolean} isPlaying - Whether video is playing
 * @property {boolean} isFullscreen - Whether in fullscreen mode
 * @property {boolean} isLoading - Whether video is loading
 * @property {boolean} hasError - Whether error occurred
 * @property {number} currentTime - Current playback time in seconds
 * @property {number} duration - Total video duration in seconds
 * @property {number} volume - Volume level (0-1)
 * @property {boolean} isMuted - Whether audio is muted
 * @property {number} playbackRate - Playback speed multiplier
 */

/**
 * Video player configuration
 * @typedef {Object} VideoPlayerConfig
 * @property {string} src - Video source URL
 * @property {string} [poster] - Poster image URL
 * @property {string} [title] - Video title for accessibility
 * @property {boolean} [autoplay=false] - Enable autoplay
 * @property {boolean} [loop=false] - Enable loop
 * @property {boolean} [muted=false] - Start muted
 * @property {boolean} [controls=true] - Show custom controls
 * @property {number} [volume=1] - Initial volume (0-1)
 * @property {number} [playbackRate=1] - Initial playback rate
 * @property {boolean} [preload='metadata'] - Preload strategy
 * @property {Array<string>} [sources] - Multiple source URLs
 * @property {Object} [captions] - Caption track configuration
 */

/**
 * Default video player configuration
 * @type {VideoPlayerConfig}
 */
const DEFAULT_CONFIG = Object.freeze({
  src: '',
  poster: '',
  title: 'Video Player',
  autoplay: false,
  loop: false,
  muted: false,
  controls: true,
  volume: 1,
  playbackRate: 1,
  preload: 'metadata',
  sources: [],
  captions: null,
});

/**
 * Playback rate options
 * @type {Array<number>}
 */
const PLAYBACK_RATES = Object.freeze([0.5, 0.75, 1, 1.25, 1.5, 2]);

/**
 * Keyboard shortcuts
 * @type {Object}
 */
const KEYBOARD_SHORTCUTS = Object.freeze({
  SPACE: ' ',
  ENTER: 'Enter',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  KEY_F: 'f',
  KEY_M: 'm',
  KEY_K: 'k',
});

/**
 * Structured event logger
 * @param {string} event - Event name
 * @param {Object} context - Event context
 */
const logEvent = (event, context = {}) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    event,
    component: 'video-player',
    ...context,
  };

  if (typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production') {
    console.log('[VideoPlayer]', logEntry);
  }

  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', event, {
      event_category: 'video',
      ...context,
    });
  }
};

/**
 * Validates URL format
 * @param {string} url - URL to validate
 * @returns {boolean} True if valid URL
 */
const isValidUrl = (url) => {
  if (typeof url !== 'string' || !url.trim()) {
    return false;
  }

  try {
    new URL(url);
    return true;
  } catch {
    return url.startsWith('data:') || url.startsWith('blob:');
  }
};

/**
 * Validates video player configuration
 * @param {Object} config - Configuration to validate
 * @returns {VideoPlayerConfig} Validated configuration
 * @throws {TypeError} If configuration invalid
 */
const validateConfig = (config) => {
  if (!config || typeof config !== 'object') {
    throw new TypeError('Video player configuration must be an object');
  }

  const validated = { ...DEFAULT_CONFIG, ...config };

  if (typeof validated.src !== 'string' || !validated.src.trim()) {
    if (!Array.isArray(validated.sources) || validated.sources.length === 0) {
      throw new TypeError('Video source URL or sources array required');
    }
  }

  if (validated.src && !isValidUrl(validated.src)) {
    throw new TypeError('Video source must be a valid URL');
  }

  if (validated.poster && typeof validated.poster !== 'string') {
    throw new TypeError('Poster must be a string');
  }

  if (typeof validated.title !== 'string' || !validated.title.trim()) {
    throw new TypeError('Title must be a non-empty string');
  }

  if (typeof validated.autoplay !== 'boolean') {
    throw new TypeError('Autoplay must be a boolean');
  }

  if (typeof validated.loop !== 'boolean') {
    throw new TypeError('Loop must be a boolean');
  }

  if (typeof validated.muted !== 'boolean') {
    throw new TypeError('Muted must be a boolean');
  }

  if (typeof validated.controls !== 'boolean') {
    throw new TypeError('Controls must be a boolean');
  }

  if (typeof validated.volume !== 'number' || validated.volume < 0 || validated.volume > 1) {
    throw new TypeError('Volume must be a number between 0 and 1');
  }

  if (typeof validated.playbackRate !== 'number' || validated.playbackRate <= 0) {
    throw new TypeError('Playback rate must be a positive number');
  }

  if (!['none', 'metadata', 'auto'].includes(validated.preload)) {
    throw new TypeError('Preload must be "none", "metadata", or "auto"');
  }

  if (Array.isArray(validated.sources)) {
    validated.sources.forEach((source, index) => {
      if (typeof source !== 'string' || !isValidUrl(source)) {
        throw new TypeError(`Source at index ${index} must be a valid URL`);
      }
    });
  }

  return validated;
};

/**
 * Formats time in MM:SS or HH:MM:SS format
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time string
 */
const formatTime = (seconds) => {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return '0:00';
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const pad = (num) => String(num).padStart(2, '0');

  if (hours > 0) {
    return `${hours}:${pad(minutes)}:${pad(secs)}`;
  }

  return `${minutes}:${pad(secs)}`;
};

/**
 * Creates video player HTML structure
 * @param {VideoPlayerConfig} config - Player configuration
 * @param {string} playerId - Unique player ID
 * @returns {string} Player HTML
 */
const createPlayerHTML = (config, playerId) => {
  const sourcesHTML = config.sources.length > 0
    ? config.sources.map((src) => `<source src="${src}" type="video/mp4">`).join('')
    : '';

  return `
    <div 
      class="video-player-container relative bg-black rounded-lg overflow-hidden shadow-2xl"
      data-player-id="${playerId}"
      role="region"
      aria-label="${config.title}"
    >
      <!-- Video Element -->
      <video
        class="video-player-element w-full h-full"
        ${config.poster ? `poster="${config.poster}"` : ''}
        ${config.autoplay ? 'autoplay' : ''}
        ${config.loop ? 'loop' : ''}
        ${config.muted ? 'muted' : ''}
        preload="${config.preload}"
        playsinline
        aria-label="${config.title}"
      >
        ${config.src ? `<source src="${config.src}" type="video/mp4">` : ''}
        ${sourcesHTML}
        <p class="text-white p-4">
          Your browser does not support the video tag.
          <a href="${config.src || config.sources[0]}" class="text-primary-400 underline">
            Download the video
          </a>
        </p>
      </video>

      <!-- Loading Overlay -->
      <div class="video-player-loading absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
        <div class="text-center">
          <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p class="text-white text-sm">Loading video...</p>
        </div>
      </div>

      <!-- Error Overlay -->
      <div class="video-player-error absolute inset-0 bg-black bg-opacity-90 flex items-center justify-center hidden">
        <div class="text-center max-w-md px-4">
          <svg class="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 class="text-white text-xl font-bold mb-2">Video Error</h3>
          <p class="text-gray-300 mb-4 video-player-error-message">Failed to load video. Please try again.</p>
          <button class="video-player-retry btn btn-primary">
            Retry
          </button>
        </div>
      </div>

      <!-- Custom Controls -->
      ${config.controls ? `
        <div class="video-player-controls absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 transition-opacity duration-300">
          <!-- Progress Bar -->
          <div class="video-player-progress-container mb-4 group cursor-pointer" role="slider" aria-label="Video progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
            <div class="relative h-1 bg-gray-600 rounded-full overflow-hidden group-hover:h-2 transition-all">
              <div class="video-player-progress-buffered absolute inset-0 bg-gray-500"></div>
              <div class="video-player-progress-bar absolute inset-0 bg-primary-500"></div>
              <div class="video-player-progress-handle absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          </div>

          <!-- Control Buttons -->
          <div class="flex items-center justify-between gap-4">
            <!-- Left Controls -->
            <div class="flex items-center gap-3">
              <!-- Play/Pause Button -->
              <button 
                class="video-player-play-pause text-white hover:text-primary-400 transition-colors"
                aria-label="Play"
              >
                <svg class="video-player-play-icon w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                <svg class="video-player-pause-icon w-8 h-8 hidden" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                </svg>
              </button>

              <!-- Volume Control -->
              <div class="flex items-center gap-2">
                <button 
                  class="video-player-mute text-white hover:text-primary-400 transition-colors"
                  aria-label="Mute"
                >
                  <svg class="video-player-volume-high-icon w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                  </svg>
                  <svg class="video-player-volume-muted-icon w-6 h-6 hidden" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                  </svg>
                </button>
                <input 
                  type="range" 
                  class="video-player-volume-slider w-20 h-1 bg-gray-600 rounded-full appearance-none cursor-pointer"
                  min="0" 
                  max="100" 
                  value="${config.volume * 100}"
                  aria-label="Volume"
                  style="background: linear-gradient(to right, #3b82f6 0%, #3b82f6 ${config.volume * 100}%, #4b5563 ${config.volume * 100}%, #4b5563 100%)"
                />
              </div>

              <!-- Time Display -->
              <div class="text-white text-sm font-mono">
                <span class="video-player-current-time">0:00</span>
                <span class="text-gray-400"> / </span>
                <span class="video-player-duration">0:00</span>
              </div>
            </div>

            <!-- Right Controls -->
            <div class="flex items-center gap-3">
              <!-- Playback Speed -->
              <div class="relative video-player-speed-container">
                <button 
                  class="video-player-speed text-white text-sm hover:text-primary-400 transition-colors"
                  aria-label="Playback speed"
                >
                  <span class="video-player-speed-value">1x</span>
                </button>
                <div class="video-player-speed-menu absolute bottom-full right-0 mb-2 bg-gray-900 rounded-lg shadow-xl py-2 hidden">
                  ${PLAYBACK_RATES.map((rate) => `
                    <button 
                      class="video-player-speed-option block w-full px-4 py-2 text-white text-sm hover:bg-gray-800 text-left ${rate === 1 ? 'bg-gray-800' : ''}"
                      data-rate="${rate}"
                    >
                      ${rate}x
                    </button>
                  `).join('')}
                </div>
              </div>

              <!-- Fullscreen Button -->
              <button 
                class="video-player-fullscreen text-white hover:text-primary-400 transition-colors"
                aria-label="Fullscreen"
              >
                <svg class="video-player-fullscreen-enter-icon w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                </svg>
                <svg class="video-player-fullscreen-exit-icon w-6 h-6 hidden" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      ` : ''}
    </div>
  `;
};

/**
 * Creates video player state manager
 * @param {HTMLVideoElement} videoElement - Video element
 * @param {VideoPlayerConfig} config - Player configuration
 * @returns {Object} State manager
 */
const createPlayerState = (videoElement, config) => {
  const state = {
    isPlaying: false,
    isFullscreen: false,
    isLoading: true,
    hasError: false,
    currentTime: 0,
    duration: 0,
    volume: config.volume,
    isMuted: config.muted,
    playbackRate: config.playbackRate,
    buffered: 0,
  };

  const updateState = (updates) => {
    Object.assign(state, updates);
    return state;
  };

  return {
    state,
    updateState,
  };
};

/**
 * Initializes video player controls and interactions
 * @param {HTMLElement} container - Player container element
 * @param {VideoPlayerConfig} config - Player configuration
 * @returns {Function} Cleanup function
 */
const initializePlayer = (container, config) => {
  const startTime = performance.now();
  const cleanupFunctions = [];

  const videoElement = container.querySelector('.video-player-element');
  const loadingOverlay = container.querySelector('.video-player-loading');
  const errorOverlay = container.querySelector('.video-player-error');
  const errorMessage = container.querySelector('.video-player-error-message');
  const retryButton = container.querySelector('.video-player-retry');

  if (!videoElement) {
    throw new Error('Video element not found in container');
  }

  const { state, updateState } = createPlayerState(videoElement, config);

  videoElement.volume = config.volume;
  videoElement.playbackRate = config.playbackRate;

  const showLoading = () => {
    if (loadingOverlay) {
      loadingOverlay.classList.remove('hidden');
    }
    updateState({ isLoading: true });
  };

  const hideLoading = () => {
    if (loadingOverlay) {
      loadingOverlay.classList.add('hidden');
    }
    updateState({ isLoading: false });
  };

  const showError = (message) => {
    hideLoading();
    if (errorOverlay) {
      errorOverlay.classList.remove('hidden');
    }
    if (errorMessage) {
      errorMessage.textContent = message;
    }
    updateState({ hasError: true });
    logEvent('video_error', { error_message: message });
  };

  const hideError = () => {
    if (errorOverlay) {
      errorOverlay.classList.add('hidden');
    }
    updateState({ hasError: false });
  };

  const updateProgress = () => {
    const progressBar = container.querySelector('.video-player-progress-bar');
    const progressHandle = container.querySelector('.video-player-progress-handle');
    const currentTimeDisplay = container.querySelector('.video-player-current-time');
    const progressContainer = container.querySelector('.video-player-progress-container');

    if (progressBar && videoElement.duration) {
      const progress = (videoElement.currentTime / videoElement.duration) * 100;
      progressBar.style.width = `${progress}%`;
      
      if (progressHandle) {
        progressHandle.style.left = `${progress}%`;
      }

      if (progressContainer) {
        progressContainer.setAttribute('aria-valuenow', String(Math.round(progress)));
      }
    }

    if (currentTimeDisplay) {
      currentTimeDisplay.textContent = formatTime(videoElement.currentTime);
    }

    updateState({ currentTime: videoElement.currentTime });
  };

  const updateBuffered = () => {
    const bufferedBar = container.querySelector('.video-player-progress-buffered');
    
    if (bufferedBar && videoElement.buffered.length > 0 && videoElement.duration) {
      const bufferedEnd = videoElement.buffered.end(videoElement.buffered.length - 1);
      const bufferedProgress = (bufferedEnd / videoElement.duration) * 100;
      bufferedBar.style.width = `${bufferedProgress}%`;
      updateState({ buffered: bufferedProgress });
    }
  };

  const updateDuration = () => {
    const durationDisplay = container.querySelector('.video-player-duration');
    
    if (durationDisplay && Number.isFinite(videoElement.duration)) {
      durationDisplay.textContent = formatTime(videoElement.duration);
      updateState({ duration: videoElement.duration });
    }
  };

  const togglePlay = () => {
    if (state.hasError) {
      return;
    }

    if (videoElement.paused) {
      const playPromise = videoElement.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            updateState({ isPlaying: true });
            updatePlayPauseButton();
            logEvent('video_play', { current_time: videoElement.currentTime });
          })
          .catch((error) => {
            console.error('[VideoPlayer] Play failed:', error);
            showError('Failed to play video. Please try again.');
          });
      }
    } else {
      videoElement.pause();
      updateState({ isPlaying: false });
      updatePlayPauseButton();
      logEvent('video_pause', { current_time: videoElement.currentTime });
    }
  };

  const updatePlayPauseButton = () => {
    const playPauseButton = container.querySelector('.video-player-play-pause');
    const playIcon = container.querySelector('.video-player-play-icon');
    const pauseIcon = container.querySelector('.video-player-pause-icon');

    if (playPauseButton) {
      playPauseButton.setAttribute('aria-label', state.isPlaying ? 'Pause' : 'Play');
    }

    if (playIcon && pauseIcon) {
      if (state.isPlaying) {
        playIcon.classList.add('hidden');
        pauseIcon.classList.remove('hidden');
      } else {
        playIcon.classList.remove('hidden');
        pauseIcon.classList.add('hidden');
      }
    }
  };

  const toggleMute = () => {
    videoElement.muted = !videoElement.muted;
    updateState({ isMuted: videoElement.muted });
    updateVolumeDisplay();
    logEvent('video_mute_toggle', { muted: videoElement.muted });
  };

  const setVolume = (volume) => {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    videoElement.volume = clampedVolume;
    videoElement.muted = clampedVolume === 0;
    updateState({ volume: clampedVolume, isMuted: clampedVolume === 0 });
    updateVolumeDisplay();
  };

  const updateVolumeDisplay = () => {
    const volumeSlider = container.querySelector('.video-player-volume-slider');
    const volumeHighIcon = container.querySelector('.video-player-volume-high-icon');
    const volumeMutedIcon = container.querySelector('.video-player-volume-muted-icon');

    if (volumeSlider) {
      const volumePercent = state.isMuted ? 0 : state.volume * 100;
      volumeSlider.value = volumePercent;
      volumeSlider.style.background = `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${volumePercent}%, #4b5563 ${volumePercent}%, #4b5563 100%)`;
    }

    if (volumeHighIcon && volumeMutedIcon) {
      if (state.isMuted || state.volume === 0) {
        volumeHighIcon.classList.add('hidden');
        volumeMutedIcon.classList.remove('hidden');
      } else {
        volumeHighIcon.classList.remove('hidden');
        volumeMutedIcon.classList.add('hidden');
      }
    }
  };

  const setPlaybackRate = (rate) => {
    videoElement.playbackRate = rate;
    updateState({ playbackRate: rate });
    
    const speedValue = container.querySelector('.video-player-speed-value');
    if (speedValue) {
      speedValue.textContent = `${rate}x`;
    }

    const speedOptions = container.querySelectorAll('.video-player-speed-option');
    speedOptions.forEach((option) => {
      const optionRate = parseFloat(option.getAttribute('data-rate'));
      if (optionRate === rate) {
        option.classList.add('bg-gray-800');
      } else {
        option.classList.remove('bg-gray-800');
      }
    });

    logEvent('video_playback_rate_change', { rate });
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await container.requestFullscreen();
        updateState({ isFullscreen: true });
        updateFullscreenButton();
        logEvent('video_fullscreen_enter');
      } else {
        await document.exitFullscreen();
        updateState({ isFullscreen: false });
        updateFullscreenButton();
        logEvent('video_fullscreen_exit');
      }
    } catch (error) {
      console.error('[VideoPlayer] Fullscreen failed:', error);
      logEvent('video_fullscreen_error', { error_message: error.message });
    }
  };

  const updateFullscreenButton = () => {
    const enterIcon = container.querySelector('.video-player-fullscreen-enter-icon');
    const exitIcon = container.querySelector('.video-player-fullscreen-exit-icon');

    if (enterIcon && exitIcon) {
      if (state.isFullscreen) {
        enterIcon.classList.add('hidden');
        exitIcon.classList.remove('hidden');
      } else {
        enterIcon.classList.remove('hidden');
        exitIcon.classList.add('hidden');
      }
    }
  };

  const handleVideoEvent = (eventName, handler) => {
    videoElement.addEventListener(eventName, handler);
    cleanupFunctions.push(() => videoElement.removeEventListener(eventName, handler));
  };

  handleVideoEvent('loadstart', () => {
    showLoading();
    logEvent('video_load_start');
  });

  handleVideoEvent('loadedmetadata', () => {
    updateDuration();
    hideLoading();
    logEvent('video_metadata_loaded', { duration: videoElement.duration });
  });

  handleVideoEvent('canplay', () => {
    hideLoading();
    hideError();
    logEvent('video_can_play');
  });

  handleVideoEvent('timeupdate', () => {
    updateProgress();
  });

  handleVideoEvent('progress', () => {
    updateBuffered();
  });

  handleVideoEvent('play', () => {
    updateState({ isPlaying: true });
    updatePlayPauseButton();
  });

  handleVideoEvent('pause', () => {
    updateState({ isPlaying: false });
    updatePlayPauseButton();
  });

  handleVideoEvent('ended', () => {
    updateState({ isPlaying: false });
    updatePlayPauseButton();
    logEvent('video_ended', { duration: videoElement.duration });
  });

  handleVideoEvent('error', () => {
    const error = videoElement.error;
    let errorMsg = 'Failed to load video. Please try again.';

    if (error) {
      switch (error.code) {
        case error.MEDIA_ERR_ABORTED:
          errorMsg = 'Video loading was aborted.';
          break;
        case error.MEDIA_ERR_NETWORK:
          errorMsg = 'Network error occurred while loading video.';
          break;
        case error.MEDIA_ERR_DECODE:
          errorMsg = 'Video decoding failed.';
          break;
        case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
          errorMsg = 'Video format not supported.';
          break;
      }
    }

    showError(errorMsg);
  });

  if (config.controls) {
    const playPauseButton = container.querySelector('.video-player-play-pause');
    if (playPauseButton) {
      const handlePlayPause = () => togglePlay();
      playPauseButton.addEventListener('click', handlePlayPause);
      cleanupFunctions.push(() => playPauseButton.removeEventListener('click', handlePlayPause));
    }

    const muteButton = container.querySelector('.video-player-mute');
    if (muteButton) {
      const handleMute = () => toggleMute();
      muteButton.addEventListener('click', handleMute);
      cleanupFunctions.push(() => muteButton.removeEventListener('click', handleMute));
    }

    const volumeSlider = container.querySelector('.video-player-volume-slider');
    if (volumeSlider) {
      const handleVolumeChange = (event) => {
        const volume = parseFloat(event.target.value) / 100;
        setVolume(volume);
      };
      volumeSlider.addEventListener('input', handleVolumeChange);
      cleanupFunctions.push(() => volumeSlider.removeEventListener('input', handleVolumeChange));
    }

    const progressContainer = container.querySelector('.video-player-progress-container');
    if (progressContainer) {
      const handleProgressClick = (event) => {
        const rect = progressContainer.getBoundingClientRect();
        const pos = (event.clientX - rect.left) / rect.width;
        videoElement.currentTime = pos * videoElement.duration;
        logEvent('video_seek', { position: pos, time: videoElement.currentTime });
      };
      progressContainer.addEventListener('click', handleProgressClick);
      cleanupFunctions.push(() => progressContainer.removeEventListener('click', handleProgressClick));
    }

    const speedButton = container.querySelector('.video-player-speed');
    const speedMenu = container.querySelector('.video-player-speed-menu');
    if (speedButton && speedMenu) {
      const handleSpeedClick = () => {
        speedMenu.classList.toggle('hidden');
      };
      speedButton.addEventListener('click', handleSpeedClick);
      cleanupFunctions.push(() => speedButton.removeEventListener('click', handleSpeedClick));

      const speedOptions = container.querySelectorAll('.video-player-speed-option');
      speedOptions.forEach((option) => {
        const handleOptionClick = () => {
          const rate = parseFloat(option.getAttribute('data-rate'));
          setPlaybackRate(rate);
          speedMenu.classList.add('hidden');
        };
        option.addEventListener('click', handleOptionClick);
        cleanupFunctions.push(() => option.removeEventListener('click', handleOptionClick));
      });

      const handleClickOutside = (event) => {
        if (!speedButton.contains(event.target) && !speedMenu.contains(event.target)) {
          speedMenu.classList.add('hidden');
        }
      };
      document.addEventListener('click', handleClickOutside);
      cleanupFunctions.push(() => document.removeEventListener('click', handleClickOutside));
    }

    const fullscreenButton = container.querySelector('.video-player-fullscreen');
    if (fullscreenButton) {
      const handleFullscreen = () => toggleFullscreen();
      fullscreenButton.addEventListener('click', handleFullscreen);
      cleanupFunctions.push(() => fullscreenButton.removeEventListener('click', handleFullscreen));
    }

    const handleFullscreenChange = () => {
      updateState({ isFullscreen: !!document.fullscreenElement });
      updateFullscreenButton();
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    cleanupFunctions.push(() => document.removeEventListener('fullscreenchange', handleFullscreenChange));
  }

  if (retryButton) {
    const handleRetry = () => {
      hideError();
      showLoading();
      videoElement.load();
      logEvent('video_retry');
    };
    retryButton.addEventListener('click', handleRetry);
    cleanupFunctions.push(() => retryButton.removeEventListener('click', handleRetry));
  }

  const handleKeyboard = (event) => {
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
      return;
    }

    switch (event.key) {
      case KEYBOARD_SHORTCUTS.SPACE:
      case KEYBOARD_SHORTCUTS.KEY_K:
        event.preventDefault();
        togglePlay();
        break;
      case KEYBOARD_SHORTCUTS.ARROW_LEFT:
        event.preventDefault();
        videoElement.currentTime = Math.max(0, videoElement.currentTime - 5);
        break;
      case KEYBOARD_SHORTCUTS.ARROW_RIGHT:
        event.preventDefault();
        videoElement.currentTime = Math.min(videoElement.duration, videoElement.currentTime + 5);
        break;
      case KEYBOARD_SHORTCUTS.ARROW_UP:
        event.preventDefault();
        setVolume(Math.min(1, state.volume + 0.1));
        break;
      case KEYBOARD_SHORTCUTS.ARROW_DOWN:
        event.preventDefault();
        setVolume(Math.max(0, state.volume - 0.1));
        break;
      case KEYBOARD_SHORTCUTS.KEY_F:
        event.preventDefault();
        toggleFullscreen();
        break;
      case KEYBOARD_SHORTCUTS.KEY_M:
        event.preventDefault();
        toggleMute();
        break;
    }
  };

  document.addEventListener('keydown', handleKeyboard);
  cleanupFunctions.push(() => document.removeEventListener('keydown', handleKeyboard));

  const renderTime = performance.now() - startTime;
  logEvent('video_player_initialized', {
    render_time_ms: renderTime.toFixed(2),
    autoplay: config.autoplay,
    has_controls: config.controls,
  });

  return () => {
    cleanupFunctions.forEach((cleanup) => cleanup());
    logEvent('video_player_cleanup');
  };
};

/**
 * Creates video player instance
 * @param {HTMLElement|string} target - Target element or selector
 * @param {Object} [customConfig] - Custom configuration
 * @returns {Object} Player instance with cleanup method
 * @throws {Error} If target not found or configuration invalid
 */
export const createVideoPlayer = (target, customConfig = {}) => {
  const startTime = performance.now();

  try {
    const targetElement =
      typeof target === 'string' ? document.querySelector(target) : target;

    if (!targetElement) {
      throw new Error(
        `Video player target element not found: ${typeof target === 'string' ? target : 'provided element'}`
      );
    }

    const config = validateConfig(customConfig);
    const playerId = `video-player-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const playerHTML = createPlayerHTML(config, playerId);
    targetElement.innerHTML = playerHTML;

    const playerContainer = targetElement.querySelector('.video-player-container');
    if (!playerContainer) {
      throw new Error('Failed to create video player container');
    }

    const cleanup = initializePlayer(playerContainer, config);

    const totalTime = performance.now() - startTime;
    logEvent('video_player_created', {
      total_time_ms: totalTime.toFixed(2),
      player_id: playerId,
    });

    return {
      element: playerContainer,
      config,
      cleanup,
    };
  } catch (error) {
    logEvent('video_player_error', {
      error_message: error.message,
      error_stack: error.stack,
    });
    throw new Error(`Failed to create video player: ${error.message}`, {
      cause: error,
    });
  }
};

export default createVideoPlayer;