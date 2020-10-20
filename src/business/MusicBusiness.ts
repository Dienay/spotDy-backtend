import { MusicDatabase } from "../data/MusicDatabase";
import { InvalidInputError } from "../error/InvalidInputError";
import { NotFoundError } from "../error/NotFoundError";
import { UnknownError } from "../error/UnknownError";
import { InputMusicFilterDTO, MusicInputDTO } from "../model/Music";
import { Authenticator } from "../services/Authenticator";
import { IdGenerator } from "../services/IdGenerator";

export class MusicBusiness {

    async createMusic(music: MusicInputDTO, token: string) {
        try {         
            if(!music.title || !music.author || !music.date || !music.file || !music.genre || !music.album ) {
                throw new InvalidInputError("All inputs are required")
            }
            
            const authenticator = new Authenticator();
            const userId = authenticator.getData(token)

            const idGenerator = new IdGenerator();
            const id = idGenerator.generate();

            const musicDatabase = new MusicDatabase();
            await musicDatabase.createMusic(id, music.title, music.author, music.date, music.file, music.genre, music.album, userId.id)
       } catch (error) {
            throw new UnknownError( error.message );
       }
    }

    async getMusicByUserId(token: string) {
      try {
            const userId = new Authenticator().getData(token)
            const musicDatabase = new MusicDatabase();
            const musics = await musicDatabase.getMusicByUserId(userId.id);
            const music = musics.map((music:any)=>({
                id: music.id,
                title: music.title,
                author: music.author,
                date: music.date,
                file: music.file,
                genre: music.genre,
                album: music.album
            }))

            if (!musics) {
                throw new NotFoundError("Music not found")
            }

            return music
        } catch(error) {
            throw new UnknownError(error.message)
        }
    }

    async getMusicById(token: string, musicId: string) {
        try {
            new Authenticator().getData(token)
            const musicDatabase = new MusicDatabase();
            const music = await musicDatabase.getMusicById(musicId);

            if (!music) {
                throw new NotFoundError("Music not found")
            }

            return music
        } catch (error) {
            throw new UnknownError(error.message)
        }
    }

    async filterMusic(token: string,inputFilter: InputMusicFilterDTO) {
        try {
            new Authenticator().getData(token)

            const validOrderByValues = ["album", "author", "genre"]
            const validOrderTypeValues = ["ASC", "DESC"]

            if(!validOrderByValues.includes(inputFilter.category)){
                throw new InvalidInputError("\"category\" values ​​should be \"album\", \"author\" or \"genre\"")
            }

            if(!validOrderTypeValues.includes(inputFilter.orderType)){
                throw new InvalidInputError("\"orderType\" values ​​should be \"ASC\" or \"DESC\"")
            }

            const result = await new MusicDatabase().filterMusic(inputFilter)

            if(!result.length){
                throw new NotFoundError("Music not found!")
            }

            return result

        } catch (error) {
            throw new UnknownError(error.message)
        }
    }
}