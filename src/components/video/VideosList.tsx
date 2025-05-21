import styled from "styled-components";
import _ from "lodash";
import VideoTile from "./VideoTile";
import RelayPagination from "../RelayPagination";
import { flexCenter } from "../../styles";
import { VideoListingQuery } from "../../__generated__/graphql";
import { PaginationInfo } from "../../hooks/useRelayPaginationQuery";
import { useCallback, useState } from "react";
import VideoActions from "./VideoActions";

type VideosListProps = {
  className?: string;
  data?: VideoListingQuery["videosConnection"];
  loading?: boolean;
  pagination: PaginationInfo;
  refetch: () => void;
};

const Placeholder = styled.div`
  ${flexCenter}
  height: 200px;
  font-size: 16px;
`;

function VideosList({
  className,
  data,
  loading,
  pagination,
  refetch,
}: VideosListProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const onActionCompleted = useCallback(() => {
    setSelectedIds([]);
    refetch();
  }, [setSelectedIds, refetch]);

  return (
    <div className={className}>
      <div>
        <RelayPagination {...pagination} />
        <VideoActions
          onActionCompleted={onActionCompleted}
          selectedIds={selectedIds}
        />
        {loading ? (
          <Placeholder>Loading...</Placeholder>
        ) : data ? (
          <>
            {data.edges.map(({ node, cursor }) => (
              <VideoTile
                key={cursor}
                video={node}
                selected={selectedIds.includes(node.id)}
                onSelectedChange={(id, isSelected) =>
                  setSelectedIds((current) =>
                    isSelected
                      ? _.union(current, [id])
                      : current.filter((cId) => cId !== id)
                  )
                }
              />
            ))}
            <RelayPagination {...pagination} />
          </>
        ) : (
          <Placeholder>No results</Placeholder>
        )}
      </div>
    </div>
  );
}

export default styled(VideosList)`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
