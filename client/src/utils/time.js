export function getTimeDifference(dateString) {
    const now = new Date();
    const targetDate = new Date(dateString);

    const nowUTC = Date.UTC(
        now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),
        now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds()
    );

    const targetDateUTC = Date.UTC(
        targetDate.getUTCFullYear(), targetDate.getUTCMonth(), targetDate.getUTCDate(),
        targetDate.getUTCHours(), targetDate.getUTCMinutes(), targetDate.getUTCSeconds()
    );

    const diffInSeconds = Math.floor((nowUTC - targetDateUTC) / 1000);
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays}d ago`;

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) return `${diffInMonths}mo ago`;

    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears}y ago`;
}
