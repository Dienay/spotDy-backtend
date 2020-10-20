export class Playlist{
    constructor(
    private id: string,
    private title: string,
    private subtitle: string,
    private date: string,
    private userId: string
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

    getUserId(){
        return this.userId;
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

    setUserId(userId: string){
        this.userId = userId;
    }

    static toPlaylistModel(user: any): Playlist {
        return new Playlist(user.id, user.title, user.subtitle, user.date, user.userId);
      }
}

export interface PlaylistInputDTO{
	title: string,
	subtitle: string,
	date: string
}

export interface AddMusicInPlaylistInputDTO{
	playlist_id: string,
	music_id: string
}

export interface InputPlaylistFilterDTO{
    title: string,
    orderType: string
}