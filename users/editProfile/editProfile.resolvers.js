import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import client from "../../client";

export default {
    Mutation: {
        editProfile: async(_, {
            firstName,
            lastName,
            username,
            email,
            password: newPassword,
            token
        }) => {
            const { id } = await jwt.verify(token, process.env.SECRET_KEY);

            let uglyPassword = null;
            if (newPassword) {
                uglyPassword = await bcrypt.hash(newPassword, 10);
            }
            const updatedUser = await client.user.update({
                where: { id },
                data: {
                    firstName, // undefined 면 prisma가 알아서 db로 값 보내지 않음
                    lastName,
                    username,
                    email,
                    ...(uglyPassword && { password: uglyPassword }), // uglyPassword 값이 있을 때만 보냄
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
        },
    }
}