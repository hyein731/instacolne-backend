import client from "../../client";

export default {
    Query: {
        seePhotoLikes: async(_, { id }) => {
            const likes = await client.like.findMany({
                where: {
                    photoId: id,
                },
                select: { // include 하면 like object 내 user 포함하여 리턴 / select 하면 user만 리턴
                    user: true,
                },
                // select: {
                //     user: {
                //         select: {
                //             username: true,
                //         },
                //     },
                // },
            });
            return likes.map(like => like.user);
        },
    },
};