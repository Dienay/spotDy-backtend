export class Playlist{
    constructor(
    private id: string,
    private title: string,
    private subtitle: string,
    private date: string,
    private image: string
    ){}

    getId(){
        return this.id;
    }

    getTitle(){
        return this.title
    }

    getSubtitle(){
        return this.subtitle;
    }

    getDate(){
        return this.date;
    }

    getImage(){
        return this.image;
    }

    setId(id: string){
        this.id = id;
    }

    setTitle(title: string){
        this.title = title;
    }

    setAuthor(subtitle: string){
        this.subtitle = subtitle;
    }

    setDate(date: string){
        this.date = date;
    }

    setFile(image: string){
        this.image = image;
	}

    static toPlaylistModel(user: any): Playlist {
        return new Playlist(user.id, user.title, user.subtitle, user.date, user.image);
      }
}

export interface PlaylistInputDTO{
	title: string,
	subtitle: string,
	date: string,
	image: string
}

export interface AddMusicInPlaylistInputDTO{
	playlist_id: string,
	music_id: string
}