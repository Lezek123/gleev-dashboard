import { useEffect, useState } from "react";
import {
  NoInfer,
  OperationVariables,
  QueryHookOptions,
  TypedDocumentNode,
  useQuery,
} from "@apollo/client";
import { PageInfo } from "../__generated__/graphql";

export type PaginationInfo = {
  pageSize: number;
  currentPage: number;
  numPages: number;
  nextPage?: () => void;
  prevPage?: () => void;
};

export function useRelayPaginationQuery<
  TData,
  RData extends { pageInfo: PageInfo; totalCount: number },
  TVariables extends OperationVariables = OperationVariables
>(
  query: TypedDocumentNode<TData, TVariables>,
  optionsFactory: (args: {
    first: number;
    after?: string;
  }) => QueryHookOptions<NoInfer<TData>, NoInfer<TVariables>>,
  extractResult: (data?: TData) => RData | undefined
) {
  const pageSize = 10;
  // const [pageSize, setPageSize] = useState(10);
  const [cursors, setCursors] = useState<(string | undefined)[]>([undefined]);
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(1);
  const { loading, data, refetch } = useQuery(
    query,
    optionsFactory({ first: pageSize, after: cursors[currentPage - 1] })
  );

  useEffect(() => {
    const result = extractResult(data);
    if (result) {
      const { pageInfo, totalCount } = result;
      if (pageInfo.hasNextPage && cursors.length < currentPage + 1) {
        setCursors((cursors) => [...cursors, pageInfo.endCursor]);
      }
      setNumPages(Math.max(cursors.length, Math.ceil(totalCount / pageSize)));
    }
  }, [data, cursors, extractResult, pageSize, currentPage]);

  const nextPageAvailable = cursors.length > currentPage;

  return {
    data: extractResult(data),
    loading,
    refetch,
    pagination: {
      pageSize,
      currentPage,
      numPages,
      nextPage: nextPageAvailable
        ? () => setCurrentPage(currentPage + 1)
        : undefined,
      prevPage:
        currentPage !== 1 ? () => setCurrentPage(currentPage - 1) : undefined,
      reset: () => {
        setCursors([undefined]);
        setCurrentPage(1);
        setNumPages(1);
      },
    },
  };
}
