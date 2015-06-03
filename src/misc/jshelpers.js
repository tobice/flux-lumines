export function range(n) {
    return Array.apply(null, Array(n)).map((_, i) => i);
}