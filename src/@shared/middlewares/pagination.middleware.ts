import { NextFunction, Request, Response } from "express";

export const handlePagination = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const queryPage = Number(req.query.page);
  const queryPerPage = Number(req.query.perPage);

  const page = queryPage && queryPage > 1 ? queryPage : 1;
  const perPage =
    queryPerPage && queryPerPage > 0 && queryPerPage < 10 ? queryPerPage : 10;

  // previousPage = http://localhost:3000/api/drivers?page=1&perPage=10
  // nextPage = http://localhost:3000/api/drivers?page=3&perPage=10

  // req.baseUrl = '/api/drivers'
  // console.log(req.protocol); // http
  // console.log(req.headers.host); // localhost:3000
  // console.log(req.baseUrl); // /api/drivers
  const url = `${req.protocol}://${req.headers.host}${req.baseUrl}`;
  console.log(url);

  const previousPage =
    page > 1 ? `${url}?page=${page - 1}&perPage=${perPage}` : null;
  const nextPage = `${url}?page=${page + 1}&perPage=${perPage}`;

  const paginationData = {
    previousPage,
    nextPage,
    page,
    perPage,
  };

  res.locals = { ...res.locals, paginationData };

  return next();
};