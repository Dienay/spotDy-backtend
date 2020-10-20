import { MusicDatabase } from "../data/MusicDatabase";
import { PlaylistDatabase } from "../data/PlaylistDatabase";
import { InvalidInputError } from "../error/InvalidInputError";
import { UnknownError } from "../error/UnknownError";
import { AddMusicInPlaylistInputDTO, InputPlaylistFilterDTO, PlaylistInputDTO } from "../model/Playlist";
import { Authenticator } from "../services/Authenticator";
import { IdGenerator } from "../services/IdGenerator";

export class PlaylistBusiness {

    async createPlaylist(music: PlaylistInputDTO, token: string) {
        try {
            if(!music.title || !music.subtitle) {
                throw new InvalidInputError("Title and subtitle are required")
            }

            const userId = new Authenticator().getData(token)

            const idGenerator = new IdGenerator();
            const id = idGenerator.generate();

            const playlistDatabase = new PlaylistDatabase();
            await playlistDatabase.createPlaylist(id, music.title, music.subtitle, music.date, userId.id)
       } catch (error) {
            throw new UnknownError( error.message);
       }
    }

    async addMusicInPlaylist(id: AddMusicInPlaylistInputDTO,token: string) {
      try {
            if (!id.music_id) {
                throw new InvalidInputError("Music not found")
            }

            new Authenticator().getData(token)

            const playlistDatabase = new PlaylistDatabase();
            await playlistDatabase.addMusicInPlaylist(id.playlist_id, id.music_id)
        } catch(error) {
            throw new UnknownError(error.message)
        }
    }

    async getPlaylistByUserId(token: string) {
        try {
            const userId = new Authenticator().getData(token)
            const playlistDatabase = new PlaylistDatabase();
            const playlists = await playlistDatabase.getPlaylistByUserId(userId.id);

            return playlists
        } catch (error) {
            throw new UnknownError(error.message)
        }
    }

    async getPlaylistById(token: string, playlistId: string) {
        try {
            if (!playlistId) {
                throw new InvalidInputError("Playlist not found")
            }

            new Authenticator().getData(token)
            const playlistDatabase = new PlaylistDatabase();
            const playlist = await playlistDatabase.getPlaylistById(playlistId);

            return playlist
        } catch (error) {
            throw new UnknownError(error.message)
        }
    }

    async getMusicsInPlaylistByPLaylistId(token: string, playlistId: string) {
        try {
            if (!playlistId) {
                throw new InvalidInputError("Playlist not found")
            }

            new Authenticator().getData(token)
            const playlistDatabase = new PlaylistDatabase();
            const collection = await playlistDatabase.getMusicsInPlaylistByPLaylistId(playlistId);

            return collection
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async filterPlaylist(token: string, inputFilter: InputPlaylistFilterDTO) {
        try {
            new Authenticator().getData(token)

            const validOrderTypeValues = ["ASC", "DESC"]

            if(!inputFilter.title){
                throw new Error("Valores para \"title\" deve ser \"title\"")
            }

            if(!validOrderTypeValues.includes(inputFilter.orderType)){
                throw new Error("Valores para \"orderType\" devem ser \"ASC\" ou \"DESC\"")
            }

            const result = await new PlaylistDatabase().filterPLaylist(inputFilter)
            if(!result.length){
                throw new Error("Playlist not found!")
            }

            return result

        } catch (error) {
            throw new Error(error.message)
        }
    }
}