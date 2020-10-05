import { BaseDatabase } from "./BaseDatabase";
import { User } from "../model/User";

export class UserDatabase extends BaseDatabase {

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
        .into(UserDatabase.TABLE_NAME);
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async getMusicById(id: string): Promise<User> {
    const result = await this.getConnection()
      .select("*")
      .from(UserDatabase.TABLE_NAME)
      .where({ id });

    return result[0];
  }
}
