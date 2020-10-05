import { UserInputDTO, LoginInputDTO } from "../model/User";
import { UserDatabase } from "../data/UserDatabase";
import { IdGenerator } from "../services/IdGenerator";
import { HashManager } from "../services/HashManager";
import { Authenticator } from "../services/Authenticator";

export class UserBusiness {

    async createUser(user: UserInputDTO) {
        try {
            if(!user.name || !user.email || !user.nickname ||!user.password){
            throw new Error("Please fill all the fields");
            }

            if(user.email.indexOf("@") === -1){
                throw new Error("Invalid Email");
            }

            if(user.password.length < 6){
                throw new Error("Password must have at least 6 characters");
            }
            const idGenerator = new IdGenerator();
            const id = idGenerator.generate();

            const hashManager = new HashManager();
            const hashPassword = await hashManager.hash(user.password);

            const userDatabase = new UserDatabase();
            await userDatabase.createUser(id, user.name, user.email, user.nickname, hashPassword, user.role);

            const authenticator = new Authenticator();
            const accessToken = authenticator.generateToken({ id, role: user.role });

            return accessToken;
        }catch(error){
            throw new Error( error.message || "Error creating user. Please check your system administrator.");
        }
    }

    async getUserByEmail(user: LoginInputDTO) {

        if (!user.email || !user.password) {
            throw new Error("Invalid information!");
        }

        if(user.email.indexOf("@") === -1){
            throw new Error("Invalid Email");
        }

        const userDatabase = new UserDatabase();
        const userFromDB = await userDatabase.getUserByEmail(user.email);

        const hashManager = new HashManager();
        const hashCompare = await hashManager.compare(user.password, userFromDB.getPassword());

        if (!hashCompare) {
            throw new Error("Invalid information!");
        }

        const authenticator = new Authenticator();
        const accessToken = authenticator.generateToken({ id: userFromDB.getId(), role: userFromDB.getRole() });

        return accessToken;
    }
}