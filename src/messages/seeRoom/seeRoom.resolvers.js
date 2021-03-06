import { protectedResolver } from "../../users/users.utils";
import client from "../../client";

export default {
    Query: {
        seeRoom: protectedResolver(async (_, { id }, { loggedInUser }) =>
            client.room.findFirst({
                where: {
                    id,
                    users: {
                        some: {
                            id: loggedInUser.id,
                        },
                    },
                },
                // include: {
                //     users: true,
                //     message: true,
                // },
            })
        ),
    },
};