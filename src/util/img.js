/**
 * Generates a single image URL with dimensions
 * @param {string} imgURL image URL
 * @param {object} dimensions dimensions {w:0, h:0} object. 'h' key is optional.
 */
export const imgURLGen = (imgURL, dimensions) => imgURL.replace('{w}', dimensions.w).replace('{h}', dimensions.h || dimensions.w);

/**
 * Generates a srcset-compatible string using a url
 * of a square image (replacing {w} and {h} with dimensions)
 * @param {string} imgURL image URL
 */
export const srcSetGen = (imgURL) => [75, 150, 300].map((dimen) => `${imgURLGen(imgURL, { w: dimen })} ${dimen}w`).join(', ');
