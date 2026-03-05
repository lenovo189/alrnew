/**
 * Parses a YouTube URL to extract the video ID and format it as an embed URL.
 * Works for standard links, shortened links (youtu.be), and embed links.
 */
export function getYouTubeEmbedUrl(url: string): string | null {
    if (!url) return null;

    // Regular expressions for different YouTube link formats
    const patterns = [
        /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/,
        /(?:https?:\/\/)?youtu\.be\/([^?&]+)/,
        /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^?&]+)/,
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
            return `https://www.youtube.com/embed/${match[1]}`;
        }
    }

    return null;
}

/**
 * Checks if a given URL is a YouTube URL.
 */
export function isYouTubeUrl(url: string): boolean {
    return !!getYouTubeEmbedUrl(url);
}
