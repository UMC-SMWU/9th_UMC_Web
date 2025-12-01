export const isPrime = (num: number) : boolean => {
    if (num <2) return false;

    //2부터 num-1까지의 수로 나누어 떨어지는지 확인
    for (let i = 2; i<num; i++) {
        if (num % i === 0) return false;
    }
    return true;
}

export const findPrimeNumbers = (max: number) => {
    const primeNumbers = [];

    for (let i = 2; i <= max; i++) {
        if (isPrime(i)) {
            primeNumbers.push(i);
        }
    }
    return primeNumbers;
};