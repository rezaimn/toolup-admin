import { reduceRight } from 'lodash';

/* FIXME */
export function or(...fns: Array<() => any>): boolean {
    return reduceRight(
        fns,
        (truth, f) => {
            return truth || f();
        },
        false
    );
}
