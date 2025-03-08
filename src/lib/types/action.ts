export type ActionReturn<T = void> = {
  success: boolean;
  field?: T;
  type?: string;
  message: string;
};
