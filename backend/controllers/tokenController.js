import getAllTokens from "../services/tokenServices.js";

const getToken = async (req,res) => {
    try {
            const { sortBy, limit, timeframe } = req.query;

            const data = await getAllTokens({
            sortBy,
            limit,
            timeframe,
            });
        res.status(200).json({
            success : true,
            data : data
        })
    } catch (error) {
        res.status(500).json({
            success : false,
            message : 'failed',
            error : error.message
        })
    }
}

export default getToken;
