export modulo_add = (i, m, n = 26) => {
    return ((i + m - 1) % n + 1);
}

export modulo_subtract = (i, m, n = 26) => {
    return ((i - m + n - 1) % n + 1);
}
