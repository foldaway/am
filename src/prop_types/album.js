import PropTypes from 'prop-types';

export default PropTypes.shape({
  id: PropTypes.string,
  attributes: PropTypes.shape({
    artistName: PropTypes.string,
    artwork: PropTypes.shape({
      width: PropTypes.number,
      height: PropTypes.number,
      url: PropTypes.string,
    }),
    name: PropTypes.string,
    trackCount: PropTypes.number,
  }),
});
