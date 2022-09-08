export const not = (fn: Function) => (...args: any[]) => !fn(...args);
