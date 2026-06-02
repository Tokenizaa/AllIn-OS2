import { c as createSsrRpc } from "./createSsrRpc-BmDEujYz.mjs";
import { a as createServerFn } from "./server-BaJh_Ojk.mjs";
import { p as paginationSchema, f as filterSchema } from "./pagination.dto-D6rx1FA4.mjs";
import { c as createOrderSchema, u as updateOrderSchema } from "./order.dto-LsqToPpL.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";
const getOrders = createServerFn({
  method: "GET"
}).inputValidator((data) => {
  return paginationSchema.merge(filterSchema).merge(objectType({
    customer_id: stringType().uuid().optional(),
    status: stringType().optional()
  })).parse(data);
}).handler(createSsrRpc("4d8939df80641fadb00757f28458dcac34bedd72761f705eb3d61287ea2f8969"));
createServerFn({
  method: "GET"
}).inputValidator((data) => {
  return objectType({
    id: stringType().uuid()
  }).parse(data);
}).handler(createSsrRpc("158a1d80449ff8100ba8e4346b6b428d4f7715934ceab2d27a32c2a9987e9840"));
createServerFn({
  method: "GET"
}).inputValidator((data) => {
  return objectType({
    customerId: stringType().uuid().optional()
  }).parse(data);
}).handler(createSsrRpc("8d3fd6ca84e41d087bcbb79c42e28566487462b6a72d1df7c982e3689569b625"));
createServerFn({
  method: "POST"
}).inputValidator((data) => {
  return createOrderSchema.parse(data);
}).handler(createSsrRpc("d8221f0ed70dc359b7707e2332653ae6969a19d94cbb0d455740f773d7aa5d2f"));
createServerFn({
  method: "POST"
}).inputValidator((data) => {
  return objectType({
    id: stringType().uuid(),
    data: updateOrderSchema
  }).parse(data);
}).handler(createSsrRpc("b5614854134378038e95d253f9ee05fcfb161d32b5e5811b2fde2a7f53bae731"));
createServerFn({
  method: "POST"
}).inputValidator((data) => {
  return objectType({
    id: stringType().uuid()
  }).parse(data);
}).handler(createSsrRpc("6ae9c9b1ece66c07e9c6825e7adc3ab368e07fdd4ae47078a43543eca36aa174"));
createServerFn({
  method: "GET"
}).inputValidator((data) => {
  return objectType({
    orderId: stringType().uuid()
  }).parse(data);
}).handler(createSsrRpc("89a297859205f32f761acf4733fc183e98bfee7776a50f8c0c157f5b38f3fe95"));
const getOrderStats = createServerFn({
  method: "GET"
}).handler(createSsrRpc("f014e964483ccaa09dec68e8a835bf2f4348373c757d80fefc750e085cb1e89a"));
export {
  getOrderStats as a,
  getOrders as g
};
