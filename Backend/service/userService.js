import User from "../models/User.js";

const getUsers = async (query) => {
    try {
        if (!query || typeof query !== 'string') {
            throw new Error('Search query must be a non-empty string');
        }
        const users = await User.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } },
            ],
        }).select('name');

        return users;
    } catch (error) {
        console.error('Error searching users:', error);
        throw new Error('Internal server error');
    }
};


export default { getUsers };