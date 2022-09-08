/**
 * Given an array, this function returns a new array where the element at a given index has been replaced.
 * @param array - The array to operate on
 * @param newElement - The element that will be placed in the new array
 * @param index - The index of the element that should be replaced
 */
export function replaceElement<T>(
    array: T[],
    newElement: T,
    index: number
): T[] {
    const copy = array.slice();
    copy[index] = newElement;
    return copy;
}
