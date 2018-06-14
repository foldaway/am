import React from 'react';
import PropTypes from 'prop-types';

const Album = (props) => (
  <div>
    <span>{props.album.attributes.name}</span>
    <span>{props.album.attributes.artistName}</span>
  </div>
);

Album.propTypes = {
  album: PropTypes.shape({
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
  }),
}

export default Album;
