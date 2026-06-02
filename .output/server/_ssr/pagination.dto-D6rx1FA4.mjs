import { o as objectType, c as coerce, e as enumType, s as stringType } from "../_libs/zod.mjs";
const paginationSchema = objectType({
  page: coerce.number().min(1).default(1),
  limit: coerce.number().min(1).max(100).default(20)
});
const filterSchema = objectType({
  search: stringType().optional(),
  sortBy: stringType().optional(),
  sortOrder: enumType(["asc", "desc"]).default("desc")
});
export {
  filterSchema as f,
  paginationSchema as p
};
