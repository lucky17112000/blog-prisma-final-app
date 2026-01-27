import { prisma } from "../../lib/prisma";



const createComment=async(payload:{
    content:string;
    postId:string;
    authorId:string;
    parentId?:string;
})=>{
    // console.log(payload);
     await prisma.post.findUniqueOrThrow({
        where:{
            id:payload.postId
        }
    })
    if(payload.parentId){
       await prisma.comment.findUniqueOrThrow({
            where:{
                id:payload.parentId
            }
        })
    }
    const result = await prisma.comment.create({
      data:payload
    })
    return result;

}
const getCommentsById=async(commentId:string)=>{
    return await prisma.comment.findUniqueOrThrow({
        where:{
            id:commentId
        },
        include:{
            post:{
                select:{
                    id:true,
                    title:true
                }
            }
        }
    })
}
const getCommentsByAuthor = async(authorId:string)=>{
    console.log(authorId);
    return await prisma.comment.findMany({
        where:{
            authorId:authorId
        },
        orderBy:{createdAt:'desc'},
        include:{
            post:{
                select:{
                    id:true,
                    title:true
                }
            }
        }
    })
}
//1.nijer comment delete korbe and login and nijer comment kina eta chk korte hobe
const deleteComment=async()=>{
    
}
export const CommentServices = {
    createComment,
    getCommentsById,
    getCommentsByAuthor,
    deleteComment
}