import { QueryResolvers, Post } from './generated/types.d';
const Query: QueryResolvers = {
    // ここが実装部分
    getPost: async (_parent, args, _context, _info) => {
      const post: Post = {
        id: '123',
        title: 'test title',
        body: 'text body',
        updateDate: new Date(),
        createDate: new Date()
      }
      return post
    },
    indexPost: async (_parent, args, _context, _info) => ([{} as Post]),
};

export const resolvers = {
    Query,
};