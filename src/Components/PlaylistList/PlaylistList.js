import React from "react";
import './PlaylistList.css';
import PlaylistListItem from "../PlaylistListItem/PlaylistListItem";

class PlaylistList extends React.Component {

    render() {
        return (
            <div className="PlaylistList">
                <h2>Your playlists</h2>
                {
                    this.props.Playlists.map(playlist => {
                        return <PlaylistListItem playlist={playlist}
                        onselectPlaylist={this.props.onselectPlaylist}
                        key={playlist.id}/>
                    })
                }
                <div className="CreateNewPlaylist">
                    <button className="Create-playlist" onClick={this.props.oncreateNewPlaylist}>CREATE NEW LIST</button>
                </div>
            </div>
        )
    }
}

export default PlaylistList;