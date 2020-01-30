import PropTypes from 'prop-types';
import albumPropType from './album';
import playlistPropType from './playlist';
import trackPropType from './track';

const chartPropType = PropTypes.shape({
  chart: PropTypes.string,
  data: PropTypes.arrayOf(
    PropTypes.oneOfType([albumPropType, playlistPropType, trackPropType]),
  ),
  href: PropTypes.string,
  name: PropTypes.string,
  next: PropTypes.string,
});

export default chartPropType;
