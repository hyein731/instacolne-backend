require("dotenv").config();
import http from "http";
import express from "express";
import logger from "morgan";
import { ApolloServer } from "apollo-server-express";
import { typeDefs, resolvers } from "./schema";
import { getUser } from "./users/users.utils";
import pubsub from "./pubsub";

const PORT = process.env.PORT;
const apollo = new ApolloServer({
    resolvers,
    typeDefs,
    context: async ({ req }) => {
        if (req) {
            return {
                loggedInUser: await getUser(req.headers.token)
            };
        }
    }
});

const app = express();
app.use(logger("tiny"));
app.use("/static", express.static("uploads")); // http://localhost:4000/static/~ 로 uploads 내 파일 접근 가능
apollo.applyMiddleware({ app });

const httpServer = http.createServer(app);
apollo.installSubscriptionHandlers(httpServer);

httpServer.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});