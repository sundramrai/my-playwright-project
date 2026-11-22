
import dotenv from 'dotenv';
import path  from 'path';
const ENV = process.env.ENV || 'dev'; 
dotenv.config({ path: path.resolve(__dirname, `../Env/.env.${ENV}`) });

export class ConfigReader{

    static readonly url= ConfigReader.getEnv('BASE_URL');
    static readonly user= ConfigReader.getEnv('USERNAME');
    static readonly password= ConfigReader.getEnv('PASSWORD');



    private static getEnv(key:string): string
    {
        const value= process.env[key];
        if(!value){
            throw new Error(`Environment '${key}' is not available`);
        }

        return value;

    }

}