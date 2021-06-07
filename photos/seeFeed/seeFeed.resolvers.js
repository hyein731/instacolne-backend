import { protectedResolver } from "../../users/users.utils";
import client from "../../client";

export default {
    Query: {
        seeFeed: protectedResolver((_, __, { loggedInUser }) => client.photo.findMany({
            where: {
                OR: [
                    {
                        user: {
                            followers: {
                                some: {
                                    id: loggedInUser.id,
                                },
                            },
                        },
                    },
                    {
                        userId: loggedInUser.id,
                    },
                ],
            },
            orderBy: {
                createdAt: "desc",
            },
        })),
    }
};