import React, { Component } from 'react';

import Album from '../Album';
import albumPropType from '../../prop_types/album';

class TrackList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tracks: [],
    };
  }

  render() {
    return (
      <div>
        <h1>TrackList</h1>
        {
          this.props.album !== null ? (
            <Album album={this.props.album} />
          ) : null
        }
      </div>
    );
  }
}

TrackList.defaultProps = {
  album: null,
};

TrackList.propTypes = {
  album: albumPropType,
};

export default TrackList;
