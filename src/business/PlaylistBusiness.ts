import { MusicDatabase } from "../data/MusicDatabase";
import { PlaylistDatabase } from "../data/PlaylistDatabase";
import { AddMusicInPlaylistInputDTO, PlaylistInputDTO } from "../model/Playlist";
import { Authenticator } from "../services/Authenticator";
import { IdGenerator } from "../services/IdGenerator";

export class PlaylistBusiness {

    async createPlaylist(music: PlaylistInputDTO, token: string) {
        try {             
            new Authenticator().getData(token)

            const idGenerator = new IdGenerator();
            const id = idGenerator.generate();

            const playlistDatabase = new PlaylistDatabase();
            await playlistDatabase.createPlaylist(id, music.title, music.subtitle, music.date, music.image)
       } catch (error) {
            throw new Error( error.message || "Error creating user. Please check your system administrator.");
       }
    }

    async addMusicInPlaylist(id: AddMusicInPlaylistInputDTO,token: string) {
      try {
            new Authenticator().getData(token)

            const playlistDatabase = new PlaylistDatabase();
            await playlistDatabase.addMusicInPlaylist(id.playlist_id, id.music_id)
        } catch(error) {
            throw new Error(error.message)
        }
    }

    async getMusicById(token: string, musicId: string) {
        try {
            new Authenticator().getData(token)
            const musicDatabase = new MusicDatabase();
            const music = await musicDatabase.getMusicById(musicId);

            return music
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async getPlaylistById(token: string, playlistId: string) {
        try {
            new Authenticator().getData(token)
            const playlistDatabase = new PlaylistDatabase();
            const playlist = await playlistDatabase.getPlaylistById(playlistId);

            return playlist
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async getPlaylist(token: string, playlistId: string) {
        try {
            new Authenticator().getData(token)
            const playlistDatabase = new PlaylistDatabase();
            const collection = await playlistDatabase.getPlaylist(playlistId);

            return collection
        } catch (error) {
            throw new Error(error.message)
        }
    }
}