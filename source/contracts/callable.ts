import { BindingKey } from "./binding.js";

export type Callable =
  | [BindingKey, CallableProperty]
  | [Function, CallableProperty]
  | [Object, CallableProperty]
  | Function
  | string;

export type CallableProperty = string | symbol;
