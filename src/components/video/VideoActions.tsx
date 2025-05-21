import styled from "styled-components";
import { colors } from "../../styles";
import { Button, Header, Icon, Message } from "semantic-ui-react";
import { LuEye, LuEyeOff, LuPin, LuPinOff } from "react-icons/lu";
import { useVideoActions } from "../../hooks/useVideoActions";
import React from "react";

const ActionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  .button {
    width: 170px;
    display: inline-flex !important;
    align-items: center;
  }
  .icon {
    display: inline-flex !important;
    align-items: center;
    justify-content: center;
  }
`;
const ActionResult = styled.div`
  grid-column: 1/-1;
`;
const SelectedVideos = styled.div`
  align-self: stretch;
  display: flex;
  flex-direction: column;
`;
const SelectedVideoIds = styled.div`
  flex-grow: 1;
  display: flex;
  margin: 5px 0;
  gap: 5px;
  padding: 5px;
  background: ${colors.bg4};
  border-radius: 5px;
`;
const SelectedVideoId = styled.div``;

type ActionButtonProps = {
  text: string;
  onClick: () => void;
  icon: React.ReactNode;
};
function ActionButton({ text, icon, onClick }: ActionButtonProps) {
  return (
    <Button size="tiny" onClick={onClick} labelPosition="left" icon compact>
      <Icon>{icon}</Icon>
      {text}
    </Button>
  );
}

type VideoActionsProps = {
  className?: string;
  selectedIds: string[];
  onActionCompleted: () => void;
};

function VideoActions({
  className,
  selectedIds,
  onActionCompleted,
}: VideoActionsProps) {
  const {
    excludeVideos,
    pinVideos,
    restoreVideos,
    unpinVideos,
    actionLoading,
    actionError,
    actionResult,
    lastAction,
    clearActionResult,
  } = useVideoActions({ onCompleted: onActionCompleted, selectedIds });

  return (
    <div className={className}>
      <SelectedVideos>
        <Header size="tiny">Selected videos:</Header>
        <SelectedVideoIds>
          {selectedIds.length ? (
            selectedIds.map((id) => <SelectedVideoId>{id}</SelectedVideoId>)
          ) : (
            <Header size="tiny" color="grey">
              None
            </Header>
          )}
        </SelectedVideoIds>
      </SelectedVideos>
      <ActionsList>
        <Header size="tiny">Action:</Header>
        <div>
          <ActionButton
            onClick={pinVideos}
            text="Pin (Home Feed)"
            icon={<LuPin />}
          />
          <ActionButton
            onClick={unpinVideos}
            text="Unpin (Home Feed)"
            icon={<LuPinOff />}
          />
        </div>
        <div>
          <ActionButton
            onClick={restoreVideos}
            text="Restore"
            icon={<LuEye />}
          />
          <ActionButton
            onClick={excludeVideos}
            text="Exclude"
            icon={<LuEyeOff />}
          />
        </div>
      </ActionsList>
      <ActionResult>
        {actionLoading && (
          <Message icon>
            <Icon name="circle notched" loading />
            <Message.Content>
              <Message.Header>Running ({lastAction})</Message.Header>
              This may take a moment...
            </Message.Content>
          </Message>
        )}
        {actionError && (
          <Message
            onDismiss={clearActionResult}
            error
            header={`Error (${lastAction})`}
            content={actionError.message}
          />
        )}
        {actionResult && (
          <Message
            onDismiss={clearActionResult}
            success
            header={`Success (${lastAction})`}
            content={`${actionResult.numberOfEntitiesAffected} update(s) made`}
          />
        )}
      </ActionResult>
    </div>
  );
}

export default styled(VideoActions)`
  display: grid;
  grid-template-columns: 1fr 350px;
  grid-template-rows: auto auto;
  gap: 10px;
  background: ${colors.bg2};
  margin: 10px 0;
  padding: 10px;
`;
