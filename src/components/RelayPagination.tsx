import styled from "styled-components";
import { PaginationInfo } from "../hooks/useRelayPaginationQuery";
import { Button, Icon } from "semantic-ui-react";

type PaginationProps = PaginationInfo & {
  className?: string;
};

const PageInfo = styled.div`
  font-size: 14px;
`;

function Pagination({
  className,
  currentPage,
  numPages,
  nextPage,
  prevPage,
}: PaginationProps) {
  return (
    <div className={className}>
      {currentPage > 1 && (
        <Button disabled={!prevPage} onClick={() => prevPage?.()} icon>
          <Icon name="arrow left" />
        </Button>
      )}
      <PageInfo>
        Page {currentPage} of ~{numPages}
      </PageInfo>
      {currentPage < numPages && (
        <Button disabled={!nextPage} onClick={() => nextPage?.()} icon>
          <Icon name="arrow right" />
        </Button>
      )}
    </div>
  );
}

export default styled(Pagination)`
  display: flex;
  gap: 10px;
  margin: 10px 0;
  justify-content: right;
  align-items: center;
`;
