import { Request, Response } from "express";
import { MusicBusiness } from "../business/MusicBusiness";
import { PlaylistBusiness } from "../business/PlaylistBusiness";
import { BaseDatabase } from "../data/BaseDatabase";
import { MusicInputDTO } from "../model/Music";
import { AddMusicInPlaylistInputDTO, PlaylistInputDTO } from "../model/Playlist";

export class PlaylistController {
    async createPlaylist(req: Request, res: Response) {
        try {
            const token = req.headers.authorization as string

            const input: PlaylistInputDTO = {
                title: req.body.title,
                subtitle: req.body.subtitle,
                date: req.body.date,
                image: req.body.image
            }

            const playlistBusiness = new PlaylistBusiness();
            await playlistBusiness.createPlaylist(input, token);

            res.status(200).send({ 
                message: "Playlist created"
             });

        } catch (error) {
            res.status(400).send({ error: error.message });
        }

        await BaseDatabase.destroyConnection();
    }

    async addMusicInPlaylist(req: Request, res: Response) {
        try{
            const token = req.headers.authorization as string

            const input: AddMusicInPlaylistInputDTO = {
                playlist_id: req.body.playlist_id,
                music_id: req.body.music_id
            }
    
            const playlistBusiness = new PlaylistBusiness();
            await playlistBusiness.addMusicInPlaylist(input, token)

            res.status(200).send({
                message: "Music added"
            });

        }catch (error) {
            res.status(400).send({
                message: "Get token error"
            });
        }
        await BaseDatabase.destroyConnection();
    }

    async getMusicById(req: Request, res: Response) {
        try {
            const token = req.headers.authorization as string;
            const musicId = req.params.id

            const musicBusiness = new MusicBusiness();
            const result = await musicBusiness.getMusicById(token, musicId)

            res.status(200).send({result});
        } catch (error) {
            res.status(400).send({
                message: "Id not found"
            });
        }
    }

    async getPlaylistById(req: Request, res: Response) {
        try {
            const token = req.headers.authorization as string;
            const playlistId = req.params.id

            const playlistBusiness = new PlaylistBusiness();
            const result = await playlistBusiness.getPlaylistById(token, playlistId)

            res.status(200).send({result});
        } catch (error) {
            res.status(400).send({
                message: "Id not found"
            });
        }
    }

    async getPlaylist(req: Request, res: Response) {
        try {
            const token = req.headers.authorization as string;
            const playlistId = req.params.id

            const playlistBusiness = new PlaylistBusiness();
            const result = await playlistBusiness.getPlaylist(token, playlistId)

            res.status(200).send({result});
        } catch (error) {
            res.status(400).send({
                message: "Id not found"
            });
        }
    }
}