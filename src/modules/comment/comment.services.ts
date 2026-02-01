import { prisma } from "../../lib/prisma";



const createComment = async (payload: {
    content: string;
    postId: string;
    authorId: string;
    parentId?: string;
}) => {
    // console.log(payload);
    await prisma.post.findUniqueOrThrow({
        where: {
            id: payload.postId
        }
    })
    if (payload.parentId) {
        await prisma.comment.findUniqueOrThrow({
            where: {
                id: payload.parentId
            }
        })
    }
    const result = await prisma.comment.create({
        data: payload
    })
    return result;

}
const getCommentsById = async (commentId: string) => {
    const result =  await prisma.comment.findUniqueOrThrow({
        where: {
            id: commentId
        },
        include: {
            post: {
                select: {
                    id: true,
                    title: true
                }
            }
        }
    })
    if(!result){
        throw new Error("Comment not found");
    }
    return result;
}
const getCommentsByAuthor = async (authorId: string) => {
    console.log(authorId);
    return await prisma.comment.findMany({
        where: {
            authorId: authorId
        },
        orderBy: { createdAt: 'desc' },
        include: {
            post: {
                select: {
                    id: true,
                    title: true
                }
            }
        }
    })
}
//1.nijer comment delete korbe and login and nijer comment kina eta chk korte hobe
const deleteComment = async (commentId: string, authorId: string) => {
    // console.log(commentId, authorId);
    const commentData = await prisma.comment.findFirst({
        where: {
            id: commentId,
            authorId: authorId
        },
        select: {
            id: true
        }
    })
    // console.log(commentData);
    if (!commentData) {
        throw new Error("You are not authorized to delete this comment");

    }
    return await prisma.comment.delete({
        where: {
            id: commentData.id
        }
    })
}
//1.on;y amar comment ami update korte parbo
//2.tai amar lagbe authodId, commentId, updatedData
const updateComment=async(commentId:string, data:{content?:string, status?:"APPROVED"|"REJECTED"} , authorId:string)=>{
// console.log(commentId, authorId, data);
const commentData = await prisma.comment.findFirst({
        where: {
            id: commentId,
            authorId: authorId
        },
        select: {
            id: true
        }
    })
    // console.log(commentData);
    if (!commentData) {
        throw new Error("You are not authorized to update this comment");

    }
    return await prisma.comment.update({
        where:{
            id:commentData.id
        },
        data:data
    })

}
const modarateComment=async(commentId:string, data:{status:"APPROVED"|"REJECTED"})=>{
  const commentData =await prisma.comment.findUniqueOrThrow({
    where:{
        id:commentId
    },
    select:{
        id:true,
        status:true
    }
  })
  if(commentData.status === data.status){
    throw new Error
  }
  return await prisma.comment.update({
    where:{
        id:commentData.id
    },
    data:data
  })
}

export const CommentServices = {
    createComment,
    getCommentsById,
    getCommentsByAuthor,
    deleteComment,
    updateComment,
    modarateComment
}