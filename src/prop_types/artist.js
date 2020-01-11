import PropTypes from 'prop-types';

const artistPropType = PropTypes.shape({
  id: PropTypes.string,
  attributes: PropTypes.shape({
    url: PropTypes.string,
    name: PropTypes.string,
    genreNames: PropTypes.arrayOf(PropTypes.string),
  }),
});

export default artistPropType;
