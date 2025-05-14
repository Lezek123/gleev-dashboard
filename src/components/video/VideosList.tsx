import { useVideos } from "./hooks/useVideos";
import styled from "styled-components";
import VideoTile from "./VideoTile";

type VideosListProps = {
  className?: string;
};

function VideosList({ className }: VideosListProps) {
  const { data, loading } = useVideos();

  return (
    <div className={className}>
      {loading
        ? "Loading..."
        : data?.videosConnection.edges.map(({ node, cursor }) => (
            <VideoTile key={cursor} video={node} />
          ))}
    </div>
  );
}

export default styled(VideosList)`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
