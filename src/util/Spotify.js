const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const redirectUri = 'http://localhost:3000/';

let accessToken;
let userId;

const Spotify = {

    async getCurrentUserId() {
        if (userId) {
            return userId;
        }

        const accessToken = await Spotify.getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}`};

        return fetch('https://api.spotify.com/v1/me', {
            headers: headers
        }).then(response => response.json()
        ).then(jsonResponse => {
            userId = jsonResponse.id;
            return userId;
        })
    },

    getAccessToken() {
        if (accessToken) {
            return accessToken;
        }

        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

        if (accessTokenMatch && expiresInMatch) {
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);

            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken;
        } else {
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`
            window.location = accessUrl;
        }
        
    },

    async search(term) {
        const accessToken = await Spotify.getAccessToken();

        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
            headers: { Authorization: `Bearer ${accessToken}`}
        }).then(response => {
            return response.json();
        }).then(jsonResponse => {
            if (!jsonResponse.tracks) {
                return [];
            }
            return jsonResponse.tracks.items.map(track => ({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri
            }));
        })
    },

    async savePlayList(name, trackURIs, playlistId) {
        if (!name || !trackURIs.length) {
            return;
        }

        const accessToken = await Spotify.getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}`};
        const userId = await Spotify.getCurrentUserId();

        if (playlistId) {
            const url = `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}`;
            await fetch (url, {
                headers: headers,
                method: 'PUT',
                body: JSON.stringify({name: name})
            });
        } else {
            const url = `https://api.spotify.com/v1/users/${userId}/playlists`;
            const response = await fetch (url, {
                headers: headers,
                method: 'POST',
                body: JSON.stringify({name: name})
            });
            const jsonResponse = await response.json();
            playlistId = jsonResponse.id
        }

        const url = `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`;
        await fetch (url, {
            headers: headers,
            method: 'PUT',
            body: JSON.stringify({ uris: trackURIs})
        })
    },

    async getUserPlaylists() {
        const accessToken = await Spotify.getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}`};
        const userId = await Spotify.getCurrentUserId();


        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
            headers: headers,
        }).then(response => {
            return response.json();
        }).then(jsonResponse => {
            if (!jsonResponse.items) {
                return [];
            }
            return jsonResponse.items.map(item => ({
                id: item.id,
                name: item.name
            }))
        })
    },

    async getPlaylist(playlistId) {
        const userId = await Spotify.getCurrentUserId();
        const accessToken = await Spotify.getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}`};

        
        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
            headers: headers
        }).then(response => {
            return response.json();
        }).then(jsonResponse => {
            if (!jsonResponse.items) {
                return [];
            }
            return jsonResponse.items.map(item => ({
                id: item.track.id,
                name: item.track.name,
                artist: item.track.artists[0].name,
                album: item.track.album.name,
                uri: item.track.uri
            }))
        })
    },

    async deletePlaylist(playlistId) {
        if (!playlistId) {
            return;
        }

        const accessToken = await Spotify.getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}`};
        const userId = await Spotify.getCurrentUserId();

        const url = `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/followers`
        await fetch (url, {
            headers: headers,
            method: 'DELETE',
        })
    }
};

export default Spotify;