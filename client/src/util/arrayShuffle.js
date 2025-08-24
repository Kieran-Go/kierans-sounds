// Fisher-yates array shuffler
export default function arrayShuffle(array) {
    const newArr = [...array]; // copy array so original is not mutated

    for (let i = newArr.length - 1; i > 0; i--) {
        // random index from 0 to i
        const j = Math.floor(Math.random() * (i + 1));

        // swap elements
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
}