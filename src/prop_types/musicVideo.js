import PropTypes from 'prop-types';

export default PropTypes.shape({
  attributes: PropTypes.shape({
    id: PropTypes.string,
    artistName: PropTypes.string,
    artwork: PropTypes.shape({
      width: PropTypes.number,
      height: PropTypes.number,
      url: PropTypes.string,
    }),
    genreNames: PropTypes.arrayOf(PropTypes.string),
    name: PropTypes.string,
    isrc: PropTypes.string,
    has4K: PropTypes.bool,
    hasHDR: PropTypes.bool,
    previews: PropTypes.arrayOf(PropTypes.shape({
      url: PropTypes.string,
      hlsUrl: PropTypes.string,
      artwork: PropTypes.shape({
        width: PropTypes.number,
        height: PropTypes.number,
        url: PropTypes.string,
      }),
    })),
    releaseDate: PropTypes.string,
    durationInMillis: PropTypes.number,
    url: PropTypes.string,
  }),
});
