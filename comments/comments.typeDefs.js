import { gql } from "apollo-server";

export default gql`
    type Comments {
        id: Int!
        user: User!
        photo: Photo!
        payload: String!
        isMine: Boolean!
        createdAt: String!
        updatedAt: String!
    }
`;