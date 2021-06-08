import pubsub from "../../pubsub";
import { NEW_MESSAGE } from "../../constants";
import { withFilter } from "apollo-server";
import client from "../../client";

export default {
    Subscription: {
        roomUpdates: {
            // #1. Public으로 아무나 리스닝해도 될 경우 
            // subscribe: () => pubsub.asyncIterator(NEW_MESSAGE),

            // #2. Filter 필요한 경우
            // subscribe: withFilter(
            //     () => pubsub.asyncIterator(NEW_MESSAGE),
            //     ({ roomUpdates }, { id }) => {
            //         return roomUpdates.roomId === id;
            //     }
            // ),

            subscribe: async(root, args, context, info) => {
                const room = await client.room.findFirst({
                    where: {
                        id: args.id,
                        users: {
                            some: {
                                id: context.loggedInUser.id,
                            },
                        },
                    },
                    select: {
                        id: true,
                    },
                });
                if (!room) throw new Error("You shall not see this.");
                return withFilter( // 두 파람 필요. 첫번째는 Iterator, 두번째는 어떤 상황일 때 보여줄지 (반드시 boolean 리턴)
                    () => pubsub.asyncIterator(NEW_MESSAGE),
                    // ({ roomUpdates }, { id }) => {
                    //     return roomUpdates.roomId === id;
                    // }

                    // 아래처럼 굳이 할 필요는 없지만 하면 User가 리스닝 후 방에서 쫓겨났을 때 그 이후 메시지 볼 수 없음
                    async ({ roomUpdates }, { id }, { loggedInUser }) => {
                        if (roomUpdates.roomId === id) {
                          const room = await client.room.findFirst({
                            where: {
                              id,
                              users: {
                                some: {
                                  id: loggedInUser.id,
                                },
                              },
                            },
                            select: {
                              id: true,
                            },
                          });
                          if (!room) {
                            return false;
                          }
                          return true;
                        }
                    }
                    //
                )(root, args, context, info);
            },
        }
    }
};