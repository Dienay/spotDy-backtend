import { Request, Response } from "express";
import { MusicBusiness } from "../business/MusicBusiness";
import { BaseDatabase } from "../data/BaseDatabase";
import { MusicInputDTO } from "../model/Music";

export class MusicController {
    async createMusic(req: Request, res: Response) {
        try {
            const token = req.headers.authorization as string

            const input: MusicInputDTO = {
                title: req.body.title,
                author: req.body.author,
                date: req.body.date,
                file: req.body.file,
                genre: req.body.genre,
                album: req.body.album
            }

            const musicBusiness = new MusicBusiness();
            await musicBusiness.createMusic(input, token);

            res.status(200).send({ 
                message: "Music created"
             });

        } catch (error) {
            res.status(400).send({ error: error.message });
        }

        await BaseDatabase.destroyConnection();
    }

    async getAllMusics(req: Request, res: Response) {
        try{
            const token = req.headers.authorization as string
            const musicBusiness = new MusicBusiness();
            const result = await musicBusiness.getAllMusics(token)

            res.status(200).send({result});

        }catch (error) {
            res.status(200).send({
                message: "Get token error"
            });
        }
        await BaseDatabase.destroyConnection();
    }
}