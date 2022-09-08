/**
 *
 * @param r path to context
 * example: const images = importAll(require.context('./', false, /\.(png|jpe?g|svg)$/));
 */
export function importAll(r: __WebpackModuleApi.RequireContext) {
    return r.keys().map(r);
}
