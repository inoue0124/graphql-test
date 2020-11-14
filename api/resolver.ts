import { QueryResolvers, Product } from './generated/types.d';
const Query: QueryResolvers = {
    // ここが実装部分
    product: async (_parent, args, _context, _info) => ({} as Product),
};

export const resolvers = {
    Query,
};