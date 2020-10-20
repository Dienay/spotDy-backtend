import { UserInputDTO, LoginInputDTO } from "../model/User";
import { UserDatabase } from "../data/UserDatabase";
import { IdGenerator } from "../services/IdGenerator";
import { HashManager } from "../services/HashManager";
import { Authenticator } from "../services/Authenticator";
import { InvalidInputError } from "../error/InvalidInputError";
import { UnauthorizedError } from "../error/AuthorizerError";
import { UnknownError } from "../error/UnknownError";

export class UserBusiness {

    async createUser(user: UserInputDTO) {
        try {
            if(!user.name || !user.email || !user.nickname ||!user.password){
            throw new InvalidInputError("Please fill all the fields");
            }

            if(user.email.indexOf("@") === -1){
                throw new InvalidInputError("Invalid Email");
            }

            if(user.password.length < 6){
                throw new InvalidInputError("Password must have at least 6 characters");
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

        try {
            if (!user.email || !user.password) {
                throw new InvalidInputError("Invalid information!");
            }
    
            if(user.email.indexOf("@") === -1){
                throw new InvalidInputError("Invalid Email");
            }
    
            const userDatabase = new UserDatabase();
            const userFromDB = await userDatabase.getUserByEmail(user.email);
    
            const hashManager = new HashManager();
            const hashCompare = await hashManager.compare(user.password, userFromDB.getPassword());
    
            if (!hashCompare) {
                throw new UnauthorizedError("Invalid information!");
            }
    
            const authenticator = new Authenticator();
            const accessToken = authenticator.generateToken({ id: userFromDB.getId(), role: userFromDB.getRole() });
    
            return accessToken;
        } catch (error) {
            throw new UnknownError( error.message)
        }
    }
}