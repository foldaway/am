import PropTypes from 'prop-types';

export default PropTypes.shape({
  attributes: PropTypes.shape({
    id: PropTypes.string,
    albumName: PropTypes.string,
    artistName: PropTypes.string,
    artwork: PropTypes.shape({
      width: PropTypes.number,
      height: PropTypes.number,
      url: PropTypes.string,
    }),
    description: PropTypes.shape({
      standard: PropTypes.string,
    }),
    name: PropTypes.string,
  }),
});
