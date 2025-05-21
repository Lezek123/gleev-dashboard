import {
  ExcludeVideosDocument,
  ExcludeVideosMutation,
  PinVideosDocument,
  PinVideosMutation,
  RestoreVideosDocument,
  RestoreVideosMutation,
  UnpinVideosDocument,
  UnpinVideosMutation,
} from "../__generated__/graphql";
import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";

type VideoAction = "exclude" | "restore" | "pin" | "unpin";

type UseVideoActionsProps = {
  selectedIds: string[];
  onCompleted(): void;
};

export function useVideoActions({
  onCompleted,
  selectedIds,
}: UseVideoActionsProps) {
  const [lastAction, setLastAction] = useState<VideoAction>();
  const [excludeVideos, excludeResult] = useMutation(ExcludeVideosDocument);
  const [pinVideos, pinResult] = useMutation(PinVideosDocument);
  const [restoreVideos, restoreResult] = useMutation(RestoreVideosDocument);
  const [unpinVideos, unpinResult] = useMutation(UnpinVideosDocument);

  const mutations = {
    exclude: excludeVideos,
    pin: pinVideos,
    restore: restoreVideos,
    unpin: unpinVideos,
  };

  const results = {
    exclude: excludeResult,
    pin: pinResult,
    restore: restoreResult,
    unpin: unpinResult,
  };

  const actionError = lastAction && results[lastAction].error;
  const actionResult = lastAction && results[lastAction].data;
  const actionLoading = lastAction && results[lastAction].loading;

  useEffect(() => {
    if (actionError || actionResult) {
      // Action result / error changed from empty to non-empty state
      // which means an action has completed
      onCompleted();
    }
  }, [actionError, actionResult, onCompleted]);

  const clearActionResult = () =>
    Object.values(results).forEach((r) => r.reset());

  const executeAction = (action: VideoAction) => {
    // Reset previous action(s) results
    clearActionResult();
    // Update last action
    setLastAction(action);
    // Run the mutation
    mutations[action]({ variables: { ids: selectedIds } });
  };

  const extractResult = () => {
    if (!actionResult) {
      return undefined;
    }
    if (lastAction === "exclude") {
      return (actionResult as ExcludeVideosMutation).excludeContent;
    }
    if (lastAction === "restore") {
      return (actionResult as RestoreVideosMutation).restoreContent;
    }
    if (lastAction === "pin") {
      return (actionResult as PinVideosMutation).setOrUnsetPublicFeedVideos;
    }
    if (lastAction === "unpin") {
      return (actionResult as UnpinVideosMutation).setOrUnsetPublicFeedVideos;
    }
  };

  return {
    excludeVideos: () => executeAction("exclude"),
    pinVideos: () => executeAction("pin"),
    restoreVideos: () => executeAction("restore"),
    unpinVideos: () => executeAction("unpin"),
    actionError,
    actionResult: extractResult(),
    actionLoading,
    lastAction,
    clearActionResult,
  };
}
