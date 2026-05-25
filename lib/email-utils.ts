export function generateRandomSuffix(length: number = 10): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

export function validatePrefix(val: string): boolean {
    // Regex for prefix: alphanumeric, dot, underscore, hyphen
    const regex = /^[a-zA-Z0-9._-]+$/;
    return regex.test(val);
}
