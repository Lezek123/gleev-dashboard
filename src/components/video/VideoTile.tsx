import styled from "styled-components";
import Flags from "./Flags";
import { colors, flexCenter } from "../../styles";
import { formatDate } from "../../utils";
import { knownLicenses } from "../../knownLicenses";
import {
  VideoListingFieldsFragment,
  VideoListingFieldsFragmentDoc,
} from "../../__generated__/graphql";
import {
  useFragment,
  FragmentType,
} from "../../__generated__/fragment-masking";
import Asset, { Placeholder } from "../Asset";

const Container = styled.div`
  display: grid;
  background: ${colors.bg1};
  column-gap: 5px;
  row-gap: 5px;
  grid-template-columns: auto repeat(7, auto);
  grid-template-rows: auto auto auto;
  font-size: 12px;
  width: 1250px;
  padding: 10px;
  color: ${colors.textDefault};
`;

const ID = styled.div`
  ${flexCenter}
  grid-row: 1 / 2;
  grid-column: -2 / -1;
  font-size: 12px;
  font-weight: bold;
  background: ${colors.bgHighlight};
  color: ${colors.textInverse};
  text-align: center;
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  font-weight: bold;
  font-size: 14px;
  grid-column: 2 / -2;
  grid-row: 1 / 2;
  background: ${colors.bg2};
  padding: 2px 5px;
`;

const Thumb = styled(Asset)`
  grid-column: 1 / 2;
  grid-row: 1 / -1;
  width: 290px;
  height: 163px;
`;

const StyledFlags = styled(Flags)`
  grid-row: 2 / 3;
  grid-column: 2 / -1;
  background: ${colors.bg2};
  display: flex;
  align-items: center;
  padding: 2px 5px;
`;

const InfoHeader = styled.div`
  font-weight: bold;
  margin-bottom: 5px;
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background: ${colors.bg2};
  padding: 5px;
`;

const ChannelInfo = styled(InfoSection)`
  display: grid;
  grid-template-rows: min-content auto;
  grid-template-columns: min-content auto;
  align-items: flex-start;
  justify-content: flex-start;
  > ${InfoHeader} {
    grid-column: 1 / -1;
    grid-row: 1 / 2;
  }
  column-gap: 8px;
`;
const ChannelAvatar = styled(Asset)`
  border-radius: 50%;
  width: 40px;
  height: 40px;
  ${Placeholder} {
    font-size: 9px;
  }
`;

const Metrics = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  justify-content: stretch;
  align-items: stretch;
  column-gap: 8px;
  row-gap: 4px;
  height: 100%;
`;
const MetricName = styled.div`
  margin: 0;
  background: ${colors.bg3};
  padding: 2px;
  font-size: 10px;
`;
const MetricValue = styled.div`
  background: ${colors.bg3};
  padding: 2px;
  font-weight: bold;
  font-size: 12px;
`;

function isVideoAccessible({
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

function isVideoListed(video: VideoListingFieldsFragment) {
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

export type VideoTileProps = {
  video: FragmentType<typeof VideoListingFieldsFragmentDoc>;
};

export function VideoTile(props: VideoTileProps) {
  const video = useFragment(VideoListingFieldsFragmentDoc, props.video);
  const {
    id,
    title,
    channel,
    isPublic,
    isCensored,
    isExcluded,
    isExplicit,
    isShort,
    isShortDerived,
    thumbnailPhoto,
    commentsCount,
    publishedBeforeJoystream,
    reactionsCount,
    viewsNum,
    videoRelevance,
    createdAt,
    category,
    includeInHomeFeed,
    nft,
    language,
    orionLanguage,
    license,
  } = video;

  const flags = {
    isAccessible: isVideoAccessible(video),
    isListed: isVideoListed(video),
    hasNft: !!nft?.id,
    isPublic,
    isExcluded,
    isCensored,
    isShort,
    isShortDerived,
    isExplicit,
  };

  const licenseData = knownLicenses.find((l) => l.code === license?.code);

  return (
    <Container>
      <ID>{id}</ID>
      {/* TODO: YT video ID? */}
      <Title>{title}</Title>
      <Thumb links={thumbnailPhoto?.resolvedUrls} alt={"Video thumbnail"} />
      <StyledFlags values={flags} />
      <ChannelInfo>
        <InfoHeader>Channel</InfoHeader>
        <ChannelAvatar
          links={channel.avatarPhoto?.resolvedUrls}
          alt={"Channel avatar"}
        />
        <Metrics>
          <MetricName>ID</MetricName>
          <MetricValue>{channel.id}</MetricValue>
          <MetricName>Name</MetricName>
          <MetricValue>{channel.title}</MetricValue>
          <MetricName>Weight</MetricName>
          <MetricValue>
            {/* TODO: Get default weight from Orion */}
            {channel.channelWeight || "1"}
          </MetricValue>
        </Metrics>
      </ChannelInfo>
      <InfoSection>
        <InfoHeader>Created (UTC)</InfoHeader>
        <Metrics>
          <MetricName>Joystream</MetricName>
          <MetricValue>{formatDate(createdAt)}</MetricValue>
          {publishedBeforeJoystream && (
            <>
              <MetricName>YouTube:</MetricName>
              <MetricValue>{formatDate(publishedBeforeJoystream)}</MetricValue>
            </>
          )}
        </Metrics>
      </InfoSection>
      <InfoSection>
        <InfoHeader>Category</InfoHeader>
        {category ? (
          <Metrics>
            <MetricName>ID</MetricName>
            <MetricValue>{category.id}</MetricValue>
            <MetricName>Name</MetricName>
            <MetricValue>{category.name}</MetricValue>
          </Metrics>
        ) : (
          "Not provided"
        )}
      </InfoSection>
      <InfoSection>
        <InfoHeader>Metrics</InfoHeader>
        <Metrics>
          <MetricName>Relevance</MetricName>
          <MetricValue>{videoRelevance}</MetricValue>
          {/* TODO: Calculated vs actual/effective relevance? */}
          <MetricName>Comments</MetricName>
          <MetricValue>{commentsCount}</MetricValue>
          <MetricName>Reactions</MetricName>
          <MetricValue>{reactionsCount}</MetricValue>
          <MetricName>Views</MetricName>
          <MetricValue>{viewsNum}</MetricValue>
        </Metrics>
      </InfoSection>
      <InfoSection>
        <InfoHeader>Featuring</InfoHeader>
        <Metrics>
          <MetricName>Homepage</MetricName>
          <MetricValue>{includeInHomeFeed ? "Yes" : "No"}</MetricValue>
          <MetricName>Category</MetricName>
          <MetricValue>
            {/* TODO: Check category featuring via another query */}
            {category?.featuredVideos.find((v) => v.id === id) ? "Yes" : "No"}
          </MetricValue>
          <MetricName>NFT</MetricName>
          <MetricValue>{nft?.isFeatured ? "Yes" : "No"}</MetricValue>
        </Metrics>
      </InfoSection>
      <InfoSection>
        <InfoHeader>Language</InfoHeader>
        <Metrics>
          <MetricName>Specified</MetricName>
          <MetricValue>{language?.toUpperCase() || "None"}</MetricValue>
          <MetricName>Detected</MetricName>
          <MetricValue>{orionLanguage?.toUpperCase() || "None"}</MetricValue>
        </Metrics>
      </InfoSection>
      <InfoSection>
        <InfoHeader>License</InfoHeader>
        {license ? (
          <Metrics>
            <MetricName>Code</MetricName>
            <MetricValue>{license.code}</MetricValue>
            <MetricName>Name</MetricName>
            <MetricValue>{licenseData?.name}</MetricValue>
            {license.attribution && (
              <>
                <MetricName>Attribution</MetricName>
                <MetricValue>{license.attribution}</MetricValue>
              </>
            )}
          </Metrics>
        ) : (
          "Not provided"
        )}
      </InfoSection>
      {/* TODO: Gleev feed position? */}
      {/* TODO: Reports */}
    </Container>
  );
}

export default VideoTile;
