export type PaginationData = {
    page: number;
    perPage: number;
    previousPage: string | null;
    nextPage: string | null;
  };
  
  // GENERICS -> TYPESCRIPT
  export type PaginationResponse<T> = {
    count: number;
    previousPage: string | null;
    nextPage: string | null;
    data: Array<T>;
  };