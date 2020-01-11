import PropTypes from 'prop-types';

const trackPropType = PropTypes.shape({
  attributes: PropTypes.shape({
    id: PropTypes.string,
    albumName: PropTypes.string,
    artistName: PropTypes.string,
    artwork: PropTypes.shape({
      width: PropTypes.number,
      height: PropTypes.number,
      url: PropTypes.string,
    }),
    name: PropTypes.string,
    trackNumber: PropTypes.number,
  }),
});
export default trackPropType;
