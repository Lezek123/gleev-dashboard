import _ from "lodash";
import {
  VideoListingFieldsFragment,
  VideoWhereInput,
} from "../../__generated__/graphql";
import { Flag } from "./flags";

type FlagFilters = { [F in Flag]: boolean | null };

export type Filters = {
  videoId: string;
  channelId: string;
  titleFragment: string;
  startDate: Date | null;
  endDate: Date | null;
  language: string;
  orionLanguage: string;
  categoryId: string;
  flags: FlagFilters;
};

export const DEFAULT_FILTERS: Filters = {
  videoId: "",
  channelId: "",
  titleFragment: "",
  startDate: null,
  endDate: null,
  language: "",
  orionLanguage: "",
  categoryId: "",
  flags: {
    isAccessible: null,
    isListed: null,
    isPinned: null,
    hasNft: null,
    isNftFeatured: null,
    isPublic: null,
    isExcluded: null,
    isCensored: null,
    isShort: null,
    isShortDerived: null,
    isExplicit: null,
    isYoutubeSync: null,
  },
};

export function isVideoAccessible({
  isCensored,
  isExcluded,
  channel,
}: VideoListingFieldsFragment) {
  // see: https://github.com/Joystream/gleev/blob/main/packages/atlas/src/config/contentFilter.ts
  return (
    !isCensored && !isExcluded && !channel.isCensored && !channel.isExcluded
    // TODO: Belongs to supported category
  );
}

export function isVideoListed(video: VideoListingFieldsFragment) {
  const { isPublic, media, thumbnailPhoto, isShort, isShortDerived, channel } =
    video;
  // see: https://github.com/Joystream/gleev/blob/main/packages/atlas/src/config/contentFilter.ts
  return (
    isVideoAccessible(video) &&
    isPublic &&
    channel.isPublic &&
    media?.isAccepted &&
    thumbnailPhoto?.isAccepted &&
    !isShort &&
    isShortDerived == null
  );
}

function strFilter<F extends VideoWhereInput>(
  expected: string,
  filter: (v: string) => F
) {
  return expected ? filter(expected) : {};
}

function boolFilter<F extends VideoWhereInput>(
  expected: boolean | null,
  filter: (v: boolean) => F
) {
  return expected !== null ? filter(expected) : {};
}

function dateFilter<F extends VideoWhereInput>(
  expected: Date | null,
  filter: (v: string) => F
) {
  return expected !== null ? filter(expected.toISOString()) : {};
}

function isAccessibleConditions(expected: boolean): VideoWhereInput[] {
  return [
    { isCensored_eq: !expected },
    { isExcluded_eq: !expected },
    { channel: { isCensored_eq: !expected } },
    { channel: { isExcluded_eq: !expected } },
  ];
}

function isAccessibleFilters(expected: boolean | null): VideoWhereInput {
  return boolFilter(expected, (v) => ({
    [v ? "AND" : "OR"]: isAccessibleConditions(v),
  }));
}

function isListedFilters(expected: boolean | null): VideoWhereInput {
  const conditions: VideoWhereInput[] = [
    ...isAccessibleConditions(!!expected),
    { isPublic_eq: expected },
    { channel: { isPublic_eq: expected } },
    { media: { isAccepted_eq: expected } },
    { thumbnailPhoto: { isAccepted_eq: expected } },
    { isShortDerived_isNull: expected },
    { OR: [{ isShort_eq: !expected }, { isShort_isNull: expected }] },
  ];

  return boolFilter(expected, (v) => ({ [v ? "AND" : "OR"]: conditions }));
}

export function parseFilters(filters: Filters): VideoWhereInput {
  const {
    videoId,
    channelId,
    categoryId,
    titleFragment,
    startDate,
    endDate,
    language,
    orionLanguage,
    flags,
  } = filters;

  const where: VideoWhereInput = {
    AND: [
      strFilter(videoId, (v) => ({ id_eq: v })),
      strFilter(channelId, (v) => ({ channel: { id_eq: v } })),
      strFilter(categoryId, (v) => ({ category: { id_eq: v } })),
      strFilter(titleFragment, (v) => ({ title_containsInsensitive: v })),
      dateFilter(startDate, (v) => ({ createdAt_gte: v })),
      dateFilter(endDate, (v) => ({ createdAt_lte: v })),
      strFilter(language, (v) => ({ language_eq: v })),
      strFilter(orionLanguage, (v) => ({ orionLanguage_eq: v })),
      isAccessibleFilters(filters.flags.isAccessible),
      isListedFilters(filters.flags.isListed),
      boolFilter(flags.hasNft, (v) => ({ nft_isNull: !v })),
      boolFilter(flags.isPublic, (v) => ({ isPublic_eq: v })),
      boolFilter(flags.isExcluded, (v) => ({ isExcluded_eq: v })),
      boolFilter(flags.isCensored, (v) => ({ isCensored_eq: v })),
      boolFilter(flags.isShort, (v) => ({ isShort_eq: v })),
      boolFilter(flags.isShortDerived, (v) => ({ isShortDerived_eq: v })),
      boolFilter(flags.isExplicit, (v) => ({ isExplicit_eq: v })),
      boolFilter(flags.isYoutubeSync, (v) => ({ ytVideoId_isNull: !v })),
      boolFilter(flags.isPinned, (v) => ({ includeInHomeFeed_eq: v })),
      boolFilter(flags.isNftFeatured, (v) => ({ nft: { isFeatured_eq: v } })),
      // TODO: Category featuring
    ].filter((v) => !_.isEmpty(v)),
  };

  return where;
}
