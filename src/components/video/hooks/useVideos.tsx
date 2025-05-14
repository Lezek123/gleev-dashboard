import { useState } from "react";
import { useQuery } from "@apollo/client";
import {
  VideoListingDocument,
  VideoOrderByInput,
} from "../../../__generated__/graphql";

export function useVideos() {
  const [pageSize, setPageSize] = useState(10);
  const [orderBy, setOrderBy] = useState(VideoOrderByInput.CreatedAtDesc);

  const { loading, data } = useQuery(VideoListingDocument, {
    variables: {
      first: pageSize,
      orderBy,
    },
  });

  return {
    pageSize,
    setPageSize,
    orderBy,
    setOrderBy,
    loading,
    data,
  };
}
