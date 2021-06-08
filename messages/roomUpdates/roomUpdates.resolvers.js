import pubsub from "../../pubsub";
import { NEW_MESSAGE } from "../../constants";

export default {
    Subscription: {
        roomUpdates: {
            subscribe: () => pubsub.asyncIterator(NEW_MESSAGE),
        }
    }
};