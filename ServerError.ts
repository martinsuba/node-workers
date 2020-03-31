export interface IServerError {
  message: string;
  code: string;
}

export default class ServerError extends Error implements IServerError {
  code: string;

  constructor({ message, code }: IServerError) {
    super(message);
    this.name = 'ServerError';
    this.code = code || 'missing_error_code';
  }
}
