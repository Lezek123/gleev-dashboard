import { useState } from "react";
import {
  VideoListingDocument,
  VideoOrderByInput,
} from "../__generated__/graphql";
import { parseFilters, Filters } from "../helpers/video/filtering";
import { useRelayPaginationQuery } from "../hooks/useRelayPaginationQuery";

type UseVideosArgs = {
  filters: Filters;
};

export function useVideos({ filters }: UseVideosArgs) {
  const [orderBy, setOrderBy] = useState(VideoOrderByInput.CreatedAtDesc);
  const { data, loading, pagination, refetch } = useRelayPaginationQuery(
    VideoListingDocument,
    (variables) => ({
      variables: {
        where: parseFilters(filters),
        orderBy,
        ...variables,
      },
    }),
    (data) => data?.videosConnection
  );

  return {
    data,
    loading,
    pagination,
    refetch,
  };
}
