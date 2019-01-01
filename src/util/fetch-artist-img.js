import ogs from 'open-graph-scraper';

/* eslint-disable consistent-return */

/**
 * Fetch an artist's image from their Apple Music webpage.
 * @param {string} artistURL URL to the artist's page
 * @returns {string} image url with {w} and {h} modifiers
 */
const fetchArtistImage = async (artistURL) => {
  const { success, data } = await ogs({ url: artistURL });

  if (!success) {
    throw Error('Error fetching ogs scrape');
  }

  if (data.ogImage instanceof Array) {
    // Probably no large image
    const [firstImage] = data.ogImage;
    data.ogImage = firstImage;
  }

  return data.ogImage.url.replace('cw.jpg', 'cc.jpg').replace('cw.png', 'cc.png').replace(/\d+?x\d+/, '{w}x{h}');
};

export default fetchArtistImage;
