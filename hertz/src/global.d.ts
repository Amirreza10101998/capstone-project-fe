declare global {
    interface Window {
        onSpotifyWebPlaybackSDKReady: () => void;
    }
}

declare global {
    interface Window {
        Spotify: typeof Spotify;
    }
}

export namespace Spotify {
    interface SpotifyPlayer {

    }
}