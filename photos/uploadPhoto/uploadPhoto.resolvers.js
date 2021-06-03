import { protectedResolver } from "../../users/users.utils";
import client from "../../client";

export default {
    Mutation: {
        uploadPhoto: protectedResolver(async(_, { file, caption }, { loggedInUser }) => {
            let hashtagObjs = [];
            if (caption) {
                const hashtags = caption.match(/#[\w]+/g);
                hashtagObjs = hashtags.map(hashtag => ({ where: { hashtag }, create: { hashtag } }));
            }
            return client.photo.create({
                data: {
                    file,
                    caption,
                    user: {
                        connect: {
                            id: loggedInUser.id,
                        },
                    },
                    ...(hashtagObjs.length > 0 && ({
                        hashtags: {
                            connectOrCreate: hashtagObjs,
                        }
                    })),
                },
            });
        }),
    }
}