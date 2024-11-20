export const createError = (status, message) => {
  const err: any = new Error();
  err.status = status;
  err.message = message;
  return err;
};
