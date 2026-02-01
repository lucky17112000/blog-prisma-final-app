import { commentStatus, Post, postStatus, Prisma } from "@prisma/client";
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
const getAllPosts = async (payload: { search?: string, tags?: string[] | [], isFeatured?: boolean | undefined, status: postStatus | undefined, authorId: string | undefined, page: number, limit: number, skip: number, sortBy?: string | undefined, sortOrder?: 'asc' | 'desc' | undefined }) => {
    // console.log("Get All Posts")
    const andConditions: Prisma.PostWhereInput[] = []
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
    if (typeof payload.isFeatured === 'boolean') {
        andConditions.push({
            isFeatured: payload.isFeatured
        })
    }
    if (payload.status) {
        andConditions.push({
            status: payload.status
        })
    }
    if (payload.authorId) {
        andConditions.push({
            authorId: payload.authorId
        })
    }
    const result = await prisma.post.findMany({
        take: payload.limit,
        skip: payload.skip,
        where: {

            AND: andConditions



        },
        orderBy: payload.sortBy && payload.sortOrder ?
            {
                [payload.sortBy]: payload.sortOrder
            } : { createdAt: 'desc' },
        include: { _count: { select: { comments: true } } }

    });
    const total = await prisma.post.count({
        where: {

            AND: andConditions
        },
    })
    return {
        data: result,
        pagination: {
            total: total,
            page: payload.page,
            limit: payload.limit,
            totalPages: Math.ceil(total / payload.limit)
        }
    }

}
const getPostById = async (postId: string) => {
    const result = await prisma.$transaction(async (tx) => {
        await tx.post.update({
            where: {
                id: postId
            },
            data: {
                views: { increment: 1 }
            }
        })
        const postData = await tx.post.findUnique({
            where: {
                id: postId
            },
            include: {
                comments: {
                    where: {
                        parentId: null,
                        // status:commentStatus.APPROVED
                    },
                    orderBy: { createdAt: 'desc' },
                    include: {
                        replies: {
                            include: {
                                replies: {
                                    include: {
                                        replies: true
                                    }
                                }
                            }
                        }
                    }
                },
                _count: {
                    select: { comments: true }
                },

            }
        })
        return postData
    })
    return result;

}
const getMyPosts = async (authorId: string) => {
    const userInfo = await prisma.user.findUniqueOrThrow({
        where:{id:authorId},
        select:{id:true, status:true}
    })
    if(userInfo.status!=='ACTIVE'){
        throw new Error('USER NOT ACTIVE');
    }
    const result = await prisma.post.findMany({
        where: {
            authorId: authorId
        },
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { comments: true } } }


    })
    //post e rtotal count
    const total = await prisma.post.aggregate({
        _count: {
            id: true
        },
        where:{
            authorId: authorId
        }
    })
    return {
        data: result, total
    };
}
export const PostServices = {
    createPost,
    getAllPosts,
    getPostById,
    getMyPosts
}
