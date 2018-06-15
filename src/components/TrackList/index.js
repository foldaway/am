import React, { Component } from 'react';

import Album from '../Album';
import Track from '../Track';
import albumPropType from '../../prop_types/album';

class TrackList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tracks: [],
    };

    this.loadTracks = this.loadTracks.bind(this);
    this.loadTracks();
  }

  componentDidUpdate() {
    this.loadTracks();
  }

  async loadTracks() {
    const albumData = await window.MusicKitInstance.api.library.album(this.props.album.id);
    this.setState({ tracks: albumData.relationships.tracks.data });
  }

  render() {
    return (
      <div>
        <h1>TrackList</h1>
        <Album album={this.props.album} />
        {
          this.state.tracks.map((track) => (
            <Track key={track.id} track={track} onSelected={() => {}} />
          ))
        }
      </div>
    );
  }
}

TrackList.propTypes = {
  album: albumPropType.isRequired,
};

export default TrackList;
