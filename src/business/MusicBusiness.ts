import { MusicDatabase } from "../data/MusicDatabase";
import { InputMusicFilterDTO, MusicInputDTO } from "../model/Music";
import { Authenticator } from "../services/Authenticator";
import { IdGenerator } from "../services/IdGenerator";

export class MusicBusiness {

    async createMusic(music: MusicInputDTO, token: string) {
        try {             
            const authenticator = new Authenticator();
            const userId = authenticator.getData(token)

            const idGenerator = new IdGenerator();
            const id = idGenerator.generate();

            const musicDatabase = new MusicDatabase();
            await musicDatabase.createMusic(id, music.title, music.author, music.date, music.file, music.genre, music.album, userId.id)
       } catch (error) {
            throw new Error( error.message || "Error creating user. Please check your system administrator.");
       }
    }

    async getMusicByUserId(token: string) {
      try {
            const userId = new Authenticator().getData(token)
            const musicDatabase = new MusicDatabase();
            const list = await musicDatabase.getMusicByUserId(userId.id);
            const music = list.map((item:any)=>({
                id: item.id,
                title: item.title,
                author: item.author,
                date: item.date,
                file: item.file,
                genre: item.genre,
                album: item.album
            }))

            return music
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

    async filterMusic(token: string,inputFilter: InputMusicFilterDTO) {
        try {
            new Authenticator().getData(token)

            const validOrderByValues = ["album", "author", "genre"]
            const validOrderTypeValues = ["ASC", "DESC"]

            if(!validOrderByValues.includes(inputFilter.category)){
                throw new Error("Valores para \"category\" devem ser \"album\", \"author\" ou \"genre\"")
            }

            if(!validOrderTypeValues.includes(inputFilter.orderType)){
                throw new Error("Valores para \"orderType\" devem ser \"ASC\" ou \"DESC\"")
            }

            const result = await new MusicDatabase().filterMusic(inputFilter)

            if(!result.length){
                throw new Error("Music not found!")
            }

            return result

        } catch (error) {
            throw new Error(error.message)
        }
    }
}