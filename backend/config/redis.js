import {createClient} from 'redis';
import dotenv from 'dotenv';
dotenv.config();


const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});


export const connectRedis = async () => {
    try{
        await redisClient.connect();
        console.log('Redis Connected')
    }catch (error) {
        console.error('Failed to connect to redis' , error);
    }
}
export default redisClient;