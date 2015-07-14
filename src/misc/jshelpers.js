export function range(n) {
    return Array.apply(null, Array(n)).map((_, i) => i);
}

export function measureTime(cb) {
    const start = performance.now();
    cb();
    return performance.now() - start;
}

export function formatNumber(number) {
    // Separate thousands by comma
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}