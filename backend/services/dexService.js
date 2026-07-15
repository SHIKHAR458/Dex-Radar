import axios from 'axios';

const getDexTokens = async ({ query = "token" } = {}) => {

    try{
        const response = await axios.get("https://api.dexscreener.com/latest/dex/search", {
            params: { q: query },
        });
        return response.data;
    } catch (error){
        console.error("DexScreener API Error", error.message);
        throw error;
    }
}

export default getDexTokens;
