import PropTypes from 'prop-types';

export default PropTypes.shape({
  id: PropTypes.string,
  attributes: PropTypes.shape({
    url: PropTypes.string,
    name: PropTypes.string,
    genreNames: PropTypes.arrayOf(PropTypes.string),
  }),
});
