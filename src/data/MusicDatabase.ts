import { BaseDatabase } from "./BaseDatabase";
import { User } from "../model/User";
import { Music } from "../model/Music";

export class MusicDatabase extends BaseDatabase {

  private static TABLE_NAME = "MUSICS";

  public async createMusic(
    id: string,
    title: string,
    author: string,
    date: string,
    file: string,
    genre: string[],
    album: string
  ): Promise<void> {
    try {
      await this.getConnection()
        .insert({
          id,
          title,
          author,
          date,
          file,
          genre,
          album
        })
        .into(MusicDatabase.TABLE_NAME);
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async getAllMusics(): Promise<Music[]> {
    const result = await this.getConnection().raw(`
        select * from ${MusicDatabase.TABLE_NAME};
    `)
    return result[0];
  }

  public async getMusicById(id: string): Promise<Music> {
    const result = await this.getConnection()
      .select("*")
      .from(MusicDatabase.TABLE_NAME)
      .where({ id });

    return result[0];
  }
}
