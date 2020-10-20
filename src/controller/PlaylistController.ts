import { Request, Response } from "express";
import { MusicBusiness } from "../business/MusicBusiness";
import { PlaylistBusiness } from "../business/PlaylistBusiness";
import { BaseDatabase } from "../data/BaseDatabase";
import moment from "moment";
import { AddMusicInPlaylistInputDTO, InputPlaylistFilterDTO, PlaylistInputDTO } from "../model/Playlist";

export class PlaylistController {
    async createPlaylist(req: Request, res: Response) {
        try {
            const token = req.headers.authorization as string

            const date = moment().format("DD/MM/YYYY")
            const input: PlaylistInputDTO = {
                title: req.body.title,
                subtitle: req.body.subtitle,
                date: date
            }

            const playlistBusiness = new PlaylistBusiness();
            await playlistBusiness.createPlaylist(input, token);

            res.status(200).send({ 
                message: "Playlist created"
             });

        } catch (error) {
            res.status(error.customErrorCode || 400).send({
                error: error.message
            });
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
            res.status(error.customErrorCode || 400).send({
                error: error.message
            });
        }
        await BaseDatabase.destroyConnection();
    }

    async getPlaylistByUserId(req: Request, res: Response) {
        try {
            const token = req.headers.authorization as string;

            const playlistBusiness = new PlaylistBusiness();
            const result = await playlistBusiness.getPlaylistByUserId(token)

            res.status(200).send({result});
        } catch (error) {
            res.status(error.customErrorCode || 400).send({
                error: error.message
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
            res.status(error.customErrorCode || 400).send({
                error: error.message
            });
        }
    }

    async getMusicsInPlaylistByPLaylistId(req: Request, res: Response) {
        try {
            const token = req.headers.authorization as string;
            const playlistId = req.params.id

            const playlistBusiness = new PlaylistBusiness();
            const result = await playlistBusiness.getMusicsInPlaylistByPLaylistId(token, playlistId)

            res.status(200).send({result});
        } catch (error) {
            res.status(error.customErrorCode || 400).send({
                error: error.message
            });
        }
    }

    async filterPlaylist(req: Request, res: Response) {
        try {
            const token = req.headers.authorization as string;

            const inputfilterPlaylist: InputPlaylistFilterDTO = {
                title: req.query.title as string,
                orderType: req.query.orderType as string || "ASC"
            }

            const result = await new PlaylistBusiness().filterPlaylist(token, inputfilterPlaylist)

            res.status(200).send(result)
        } catch (error) {
            res.status(error.customErrorCode || 400).send({
                error: error.message
            });
        }
    }
}