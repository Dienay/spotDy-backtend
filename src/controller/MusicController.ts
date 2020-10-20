import { query, Request, Response } from "express";
import { MusicBusiness } from "../business/MusicBusiness";
import { BaseDatabase } from "../data/BaseDatabase";
import { InputMusicFilterDTO, MusicInputDTO } from "../model/Music";

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

    async getMusicByUserId(req: Request, res: Response) {
        try{
            const token = req.headers.authorization as string
            const musicBusiness = new MusicBusiness();
            const result = await musicBusiness.getMusicByUserId(token)

            res.status(200).send({result});

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

    async filterMusic(req: Request, res: Response) {
        console.log("controller")
        try {
            const token = req.headers.authorization as string;

            const inputfilterMusic: InputMusicFilterDTO = {
                category: req.query.category as string,
                input: req.query.input as string,
                orderType: req.query.orderType as string || "ASC"
            }

            const result = await new MusicBusiness().filterMusic(token, inputfilterMusic)

            res.status(200).send(result)
        } catch (error) {
            res.status(400).send({
                message: "Music not found!"
            });
        }
    }
}