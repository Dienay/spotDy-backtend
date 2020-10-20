import { BaseDatabase } from "./BaseDatabase";
import { InputPlaylistFilterDTO, Playlist } from "../model/Playlist";
import { Music } from "../model/Music";

export class PlaylistDatabase extends BaseDatabase {

  private static TABLE_PLAYLIST = "PLAYLIST";
  private static TABLE_COLLECTION = "COLLECTION";

  public async createPlaylist(
    id: string,
    title: string,
    subtitle: string,
    date: string,
    user_id: string
  ): Promise<void> {
    try {
      await this.getConnection()
        .insert({
          id,
          title,
          subtitle,
          date,
          user_id
        })
        .into(PlaylistDatabase.TABLE_PLAYLIST);
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async addMusicInPlaylist(
    playlist_id: string,
    music_id: string
  ): Promise<void> {
    try {
      await this.getConnection()
        .insert({
          playlist_id,
          music_id
        })
        .into(PlaylistDatabase.TABLE_COLLECTION);
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async getPlaylistByUserId(userID: string): Promise<any> {
    const result = await this.getConnection()
      .select("*")
      .from(PlaylistDatabase.TABLE_PLAYLIST)
      .where({ user_id: userID });

      const playlists: Playlist[] = []

      for (let playlist of result) {
        playlists.push(Playlist.toPlaylistModel(playlist));
      }

      return playlists;
  }

  public async getPlaylistById(playlistId: string): Promise<any> {
    const result = await this.getConnection()
      .select("*")
      .from("PLAYLIST")
      .where({ id: playlistId });

      return result[0];
  }

  public async getMusicsInPlaylistByPLaylistId(playlistId: string): Promise<any> {
    const result = await this.getConnection().raw(`
      select MUSICS.title, MUSICS.author from COLLECTION
      join PLAYLIST
      on PLAYLIST.id = COLLECTION.playlist_id
      join MUSICS
      on COLLECTION.music_id = MUSICS.id
      where COLLECTION.playlist_id = '${playlistId}';
    `)

      return result[0];
  }

  public async filterPLaylist(inputPLaylistFilter: InputPlaylistFilterDTO):Promise<any> {
    try {
      const result = await this.getConnection().raw(`
                SELECT * FROM ${PlaylistDatabase.TABLE_PLAYLIST}  
                WHERE title like "%${inputPLaylistFilter.title.toLocaleLowerCase()}%"
                ORDER BY title ${inputPLaylistFilter.orderType} ;  
            `)

            return result[0]
    } catch (error) {
      throw new Error(error.sqlMessage)
    }
  }
}
