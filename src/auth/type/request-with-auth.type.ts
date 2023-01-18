export type RequestWithAuth = Request & {
  headers: {
    authorization: string;
  };
};
