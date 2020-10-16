import { BaseDatabase } from "./BaseDatabase";
import { User } from "../model/User";
import { Music } from "../model/Music";

export class PlaylistDatabase extends BaseDatabase {

  private static TABLE_PLAYLIST = "PLAYLIST";
  private static TABLE_COLLECTION = "COLLECTION";
  private static TABLE_MUSICS = "MUSICS";

  public async createPlaylist(
    id: string,
    title: string,
    subtitle: string,
    date: string,
    image: string
  ): Promise<void> {
    try {
      await this.getConnection()
        .insert({
          id,
          title,
          subtitle,
          date,
          image
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

  public async getMusicById(musicId: string): Promise<Music> {
    const result = await this.getConnection()
      .select("*")
      .from(PlaylistDatabase.TABLE_PLAYLIST)
      .where({ id: musicId });

      return Music.toMusicModel(result[0]);
  }

  public async getPlaylistById(playlistId: string): Promise<any> {
    const result = await this.getConnection()
      .select("*")
      .from("PLAYLIST")
      .where({ id: playlistId });

      return result[0];
  }

  public async getPlaylist(playlistId: string): Promise<any> {
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
}
