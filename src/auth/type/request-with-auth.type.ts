export type RequestWithAuth = Request & {
  headers: {
    Authorization: string;
  };
};
