import { createWriteStream } from "fs";
import bcrypt from "bcrypt";
import client from "../../client";
import { protectedResolver } from "../users.utils";

const resolverFn = async(
    _, 
    { firstName, lastName, username, email, password: newPassword, bio, avatar },
    { loggedInUser } // context에 넣는 것은 모든 resolver에서 접근 가능
) => {
    let avatarUrl = null;
    if (avatar) {
        const { filename, createReadStream } = await avatar;
        const newFilename = `${loggedInUser.id}-${Date.now()}-${filename}`
        const readStream = createReadStream();
        const writeStream = createWriteStream(process.cwd() + "/uploads/" + newFilename);
        readStream.pipe(writeStream);
        avatarUrl = `http://localhost:4000/static/${newFilename}`;
    }

    let uglyPassword = null;
    if (newPassword) {
        uglyPassword = await bcrypt.hash(newPassword, 10);
    }
    const updatedUser = await client.user.update({
        where: { id: loggedInUser.id },
        data: {
            firstName, // undefined 면 prisma가 알아서 db로 값 보내지 않음
            lastName,
            username,
            email,
            bio,
            ...(uglyPassword && { password: uglyPassword }), // uglyPassword 값이 있을 때만 보냄
            ...(avatarUrl && { avatar: avatarUrl }),
        },
    });
    if (updatedUser.id) {
        return {
            ok: true
        };
    } else {
        return {
            ok: false,
            error: "Could not update profile."
        };
    }
};

export default {
    Mutation: {
        editProfile: protectedResolver(resolverFn)
    }
}