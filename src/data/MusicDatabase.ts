import { BaseDatabase } from "./BaseDatabase";
import { User } from "../model/User";
import { InputMusicFilterDTO, Music } from "../model/Music";

export class MusicDatabase extends BaseDatabase {

  private static TABLE_NAME = "MUSICS";

  public async createMusic(
    id: string,
    title: string,
    author: string,
    date: string,
    file: string,
    genre: string[],
    album: string,
    user_id: string
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
          album,
          user_id
        })
        .into(MusicDatabase.TABLE_NAME);
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async getMusicByUserId(userId: string): Promise<Music[]> {
    const result = await this.getConnection()
      .select('*')
      .from(MusicDatabase.TABLE_NAME)
      .where({user_id: userId});

      const musics: Music[] = [];

      for (let music of result) {
        musics.push(Music.toMusicModel(music));
      }

    return musics;
  }

  public async getMusicById(musicId: string): Promise<Music> {
    const result = await this.getConnection()
      .select("*")
      .from(MusicDatabase.TABLE_NAME)
      .where({ id: musicId });

      return Music.toMusicModel(result[0]);
  }

  public async filterMusic(inputFilter: InputMusicFilterDTO):Promise<any> {
    console.log("controller")
    try {
      const result = await this.getConnection().raw(`
                SELECT * FROM ${MusicDatabase.TABLE_NAME}  
                WHERE ${inputFilter.category} like "%${inputFilter.input.toLocaleLowerCase()}%"
                ORDER BY ${inputFilter.category} ${inputFilter.orderType} ;  
            `)

            return result[0]
    } catch (error) {
      throw new Error(error.sqlMessage)
    }
  }
}
