import { reduceRight } from 'lodash';

export function and(...fns: any[]): boolean {
    return reduceRight(
        fns,
        (truth, f) => {
            return truth && f();
        },
        true
    );
}
