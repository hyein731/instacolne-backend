import { protectedResolver } from "../../users/users.utils";
import client from "../../client";
import { processHashtags } from "../photos.utils";
import { uploadToS3 } from "../../shared/shared.utils";

export default {
    Mutation: {
        uploadPhoto: protectedResolver(async(_, { file, caption }, { loggedInUser }) => {
            let hashtagObjs = [];
            if (caption) {
                hashtagObjs =  processHashtags(caption);
            }
            const fileUrl = await uploadToS3(file, loggedInUser.id, "uploads");
            return client.photo.create({
                data: {
                    file: fileUrl,
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