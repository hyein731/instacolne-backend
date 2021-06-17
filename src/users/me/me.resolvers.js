import { protectedResolver } from "../users.utils";
import client from "../../client";

export default {
    Query: {
        me: protectedResolver((_, __, { loggedInUser }) => client.user.findUnique({
            where: {
                id: loggedInUser.id,
            },
        })),
    }
};