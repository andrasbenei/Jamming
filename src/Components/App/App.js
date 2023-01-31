
import './App.css';
import React from 'react';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';
import PlaylistList from '../PlaylistList/PlaylistList';


class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchResults : [],
      playlistName : 'My New Playlist',
      playlistTracks: [],
      playlistId : null,
      Playlists : []
    }

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    this.selectPlaylist = this.selectPlaylist.bind(this);
    this.deletePlaylist = this.deletePlaylist.bind(this);
    this.updatePlaylists = this.updatePlaylists.bind(this);
    this.createNewPlaylist = this.createNewPlaylist.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
  }

  addTrack(track) {
    let tracks = this.state.playlistTracks
    if (tracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    }
    
    tracks.push(track)
    this.setState({playlistTracks: tracks});
  }

  removeTrack(track) {
    let tracks = this.state.playlistTracks;
    tracks = tracks.filter(currentTrack => currentTrack.id !== track.id);

    this.setState({ playlistTracks: tracks});
  }

  updatePlaylistName(newName) {
    this.setState({ playlistName : newName });
  }

  async savePlaylist() {
    const trackURIs = this.state.playlistTracks.map(track => track.uri);
    await Spotify.savePlayList(this.state.playlistName, trackURIs, this.state.playlistId)
    this.createNewPlaylist();
    await this.updatePlaylists();
  }

  search(term) {
    Spotify.search(term).then(searchResults => {
      this.setState({searchResults: searchResults})
    })
  }

  selectPlaylist(playlist) {
    this.updatePlaylistName(playlist.name);
    this.setState({ playlistId : playlist.id });
    Spotify.getPlaylist(playlist.id).then(playlistTracks => {
      this.setState({playlistTracks: playlistTracks})
    })
  }

  async deletePlaylist() {
    await Spotify.deletePlaylist(this.state.playlistId);
    await this.updatePlaylists();
    this.createNewPlaylist();
  }

  async updatePlaylists() {
    await Spotify.getUserPlaylists().then(Playlists => {
      this.setState({Playlists: Playlists})
    }) 
  }

  createNewPlaylist() {
    this.setState({
      playlistName: 'My New Playlist',
      playlistTracks: [],
      playlistId: null
    })
  }

  componentDidMount() {
    this.updatePlaylists();
  }

  render() {
    return (
      <div>
        <h1>Ja<span className='highlight'>mmm</span>ing</h1>
        <div className='App'>
          <SearchBar onSearch={this.search}/>
          <div className='App-playlist'>
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
            <Playlist playlistName={this.state.playlistName}
              playlistTracks={this.state.playlistTracks}
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist}
              ondeletePlaylist={this.deletePlaylist}/>
            <PlaylistList onselectPlaylist={this.selectPlaylist}
              onupdatePlaylists={this.updatePlaylists}
              Playlists={this.state.Playlists}
              oncreateNewPlaylist={this.createNewPlaylist}/>
          </div>
        </div>
      </div>
    )
  }

}

export default App;
