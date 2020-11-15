import { QueryResolvers, Post, MutationResolvers, MutationResult } from './generated/types.d';
import * as aws from 'aws-sdk';

const localDynamodb: aws.DynamoDB.DocumentClient = new aws.DynamoDB.DocumentClient({
  region: 'us-east-1',
  endpoint: "http://localhost:3030"
});

const Query: QueryResolvers = {

    getPost: async (_parent, args, _context, _info) => {
      const getParams: aws.DynamoDB.DocumentClient.GetItemInput = {
        TableName: 'Posts',
        Key: {
          id: args.id
        }
      }
  
      return await (await localDynamodb.get(getParams).promise()).Item as Post
    },
    indexPost: async (_parent, args, _context, _info) => ([{} as Post])
};

const Mutation: MutationResolvers = {
  createPost: async (_parent, args, _context, _info) => {

    const post: Post = {
      id: getUniqueStr(),
      title: args.postCreateInput.title,
      body: args.postCreateInput.body,
      updateDate: Date.now(),
      createDate: Date.now()
    }

    const putParams: aws.DynamoDB.DocumentClient.PutItemInput = {
      TableName: 'Posts',
      Item: post
    }
    await localDynamodb.put(putParams).promise()

    const getParams: aws.DynamoDB.DocumentClient.GetItemInput = {
      TableName: 'Posts',
      Key: {
        id: post.id
      }
    }

    return await (await localDynamodb.get(getParams).promise()).Item as Post
  },

  updatePost: async (_parent, args, _context, _info) => {

    const updateParams: aws.DynamoDB.DocumentClient.UpdateItemInput = {
      TableName: 'Posts',
      Key: {
        id: args.postUpdateInput.id
      },
      UpdateExpression: "set title = :t, body = :b, updateDate = :u",
      ExpressionAttributeValues: {
        ":t": args.postUpdateInput.title,
        ":b": args.postUpdateInput.body,
        ":u": Date.now()
      },
      ReturnValues:"ALL_NEW"
    }
    const returnValue = await localDynamodb.update(updateParams).promise()

    return returnValue.Attributes as Post
  },

  deletePost: async (_parent, args, _context, _info) => {

    const deleteParams: aws.DynamoDB.DocumentClient.DeleteItemInput = {
      TableName: 'Posts',
      Key: {
        id: args.postDeleteInput.id
      }
    }
    await localDynamodb.delete(deleteParams).promise()

    const mutationResult: MutationResult = {
      errorCode: "",
      validationError: [{
        fieldName: "",
        validationCode: ""
      }]
    }
    return mutationResult
  }
}

function getUniqueStr(myStrong?: number): string {
  let strong = 1000;
  if (myStrong) strong = myStrong;
  return (
    new Date().getTime().toString(16) +
    Math.floor(strong * Math.random()).toString(16)
  );
}

export const resolvers = {
    Query,
    Mutation
};