import { Post, Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";

const createPost = async (data: Omit<Post, "id" | "createdAt" | "updatedAt" | 'authorId'>, userId: string) => {
    const result = await prisma.post.create({
        data: {
            ...data,
            authorId: userId
        }
    })
    return result;

}
const getAllPosts = async (payload: { search?: string, tags?: string[] | [] }) => {
    // console.log("Get All Posts")
    const andConditions:Prisma.PostWhereInput[] = []
    if (payload.search) {
        andConditions.push({
            OR: [

                {
                    title: {
                        contains: payload.search as string,
                        mode: "insensitive"
                    },
                },
                {
                    content: {
                        contains: payload.search as string,
                        mode: "insensitive"
                    }
                }

            ]
        })

    }
    if (payload.tags && payload.tags.length > 0) {
        andConditions.push({
            tags: {
                hasSome: payload.tags as string[]
            }
        })
    }
    const result = await prisma.post.findMany({
        where: {

            AND: andConditions
                
            

        }
    });
    return result;

}
export const PostServices = {
    createPost,
    getAllPosts
}