export function range(n) {
    return Array.apply(null, Array(n)).map((_, i) => i);
}

export function measureTime(cb) {
    let start = performance.now();
    cb();
    return performance.now() - start;
}