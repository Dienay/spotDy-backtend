export class Music{
    constructor(
    private id: string,
    private title: string,
    private author: string,
    private date: string,
    private file: string,
    private genre: string[],
    private album: string
    ){}

    getId(){
        return this.id;
    }

    getTitle(){
        return this.title
    }

    getAuthor(){
        return this.author;
    }

    getDate(){
        return this.date;
    }

    getFile(){
        return this.file;
    }

    getGenre(){
        return this.genre;
	}
	
    getAlbum(){
        return this.album;
    }

    setId(id: string){
        this.id = id;
    }

    setTitle(title: string){
        this.title = title;
    }

    setAuthor(author: string){
        this.author = author;
    }

    setDate(date: string){
        this.date = date;
    }

    setFile(file: string){
        this.file = file;
	}
	
    setGenre(genre: string[]){
        this.genre = genre;
    }
	
    setAlbum(album: string){
        this.album = album;
    }

    static toUserModel(user: any): Music {
        return new Music(user.id, user.title, user.author, user.date, user.file, user.genre, user.album);
      }
}

export interface MusicInputDTO{
	title: string,
	author: string,
	date: string,
	file: string,
	genre: string[],
	album: string
}
