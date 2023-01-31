import React from "react";
import './PlaylistListItem.css';


class PlaylistListItem extends React.Component {
    constructor(props) {
        super(props);
        this.selectPlaylist = this.selectPlaylist.bind(this)
    }

    selectPlaylist() {
        this.props.onselectPlaylist(this.props.playlist)
    }

    render() {
        return (
            <div className="PlaylistListItem">
                <div className="PlaylistListItem-information">
                    <button className="PlaylistListItem-action" onClick={this.selectPlaylist}>{this.props.playlist.name}</button>
                </div>
            </div>
        )
    }
}

export default PlaylistListItem;