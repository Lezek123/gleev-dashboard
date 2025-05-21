import { useState } from "react";
import styled from "styled-components";
import { colors, flexCenter } from "../styles";

export const Placeholder = styled.div`
  width: 100%;
  height: 100%;
  padding: 5px;
  font-size: 14px;
  ${flexCenter}
  text-align: center;
  background: ${colors.bg2};
`;
const LoadingPlaceholder = styled(Placeholder)`
  color: ${colors.textDefault};
`;
const FailedPlaceholder = styled(Placeholder)`
  color: ${colors.textError};
`;
const EmptyPlaceholder = styled(Placeholder)`
  color: ${colors.textWarn};
`;

const Image = styled.img<{ loading?: boolean }>`
  display: ${({ loading }) => (loading ? "none" : "block")};
  width: 100%;
  height: 100%;
`;

export type AssetProps = {
  links?: string[];
  alt: string;
  className?: string;
  emptyText?: string;
  failedText?: string;
};

function Asset({ links, alt, className, emptyText, failedText }: AssetProps) {
  const [linkIdx, setLinkIdx] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [failed, setFailed] = useState<boolean>(false);

  return (
    <div className={className}>
      {failed ? (
        <FailedPlaceholder>
          {failedText || `Failed to load ${alt}`}
        </FailedPlaceholder>
      ) : !links || !links.length ? (
        <EmptyPlaceholder>{emptyText || `Missing ${alt}`}</EmptyPlaceholder>
      ) : (
        <>
          {loading && <LoadingPlaceholder>Loading...</LoadingPlaceholder>}
          <Image
            src={links[linkIdx]}
            alt={alt}
            loading={loading}
            onLoad={() => setLoading(false)}
            onError={() => {
              if (linkIdx < links.length - 1) {
                setLoading(true);
                setLinkIdx(linkIdx + 1);
              } else {
                setLoading(false);
                setFailed(true);
              }
            }}
          />
        </>
      )}
    </div>
  );
}

export default styled(Asset)`
  overflow: hidden;
`;
