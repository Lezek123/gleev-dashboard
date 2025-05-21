import styled from "styled-components";
import VideosList from "./VideosList";
import VideoFilters from "./VideoFilters";
import { useState } from "react";
import { DEFAULT_FILTERS, Filters } from "../../helpers/video/filtering";
import { useVideos } from "../../hooks/useVideos";

type VideosProps = {
  className?: string;
};

function VideosView({ className }: VideosProps) {
  const [filters, setFilters] = useState<Filters>({
    ...DEFAULT_FILTERS,
  });
  const { data, loading, pagination, refetch } = useVideos({ filters });

  return (
    <div className={className}>
      <VideoFilters
        currentFilters={filters}
        onSubmit={(filters) => {
          pagination.reset();
          setFilters(filters);
        }}
      />
      <VideosList
        data={data}
        loading={loading}
        pagination={pagination}
        refetch={refetch}
      />
    </div>
  );
}

export default styled(VideosView)`
  display: flex;
  flex-direction: column;
  width: 1250px;
`;
