export default class CustomError {
  static createError({ name = "Error", cause, message, code = 1 }) {
      const err = new Error(message, { cause: new Error(cause) });
      err.name = name;
      err.code = code;
      throw err;
  };
}