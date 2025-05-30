import {
  LuAlertCircle,
  LuBadgeDollarSign,
  LuCheck,
  LuCircleOff,
  LuEye,
  LuEyeOff,
  LuHardDriveUpload,
  LuListChecks,
  LuListX,
  LuMegaphone,
  LuMegaphoneOff,
  LuMonitorCheck,
  LuMonitorOff,
  LuPin,
  LuPinOff,
  LuRectangleVertical,
  LuStar,
  LuStarOff,
  LuTimer,
  LuTimerOff,
  LuUsers,
  LuUserX,
  LuX,
  LuYoutube,
} from "react-icons/lu";
import { colors } from "../../styles";
import _ from "lodash";

export type FlagStateOverrides = {
  hide?: boolean;
  color?: string;
  textColor?: string;
  icon?: React.ReactNode;
  name?: string;
};

export type FlagOverrides = {
  active?: FlagStateOverrides;
  inactive?: FlagStateOverrides;
};

export type Flag =
  | "isPinned"
  | "isAccessible"
  | "isListed"
  | "isYoutubeSync"
  | "hasNft"
  | "isPublic"
  | "isExcluded"
  | "isCensored"
  | "isShort"
  | "isShortDerived"
  | "isExplicit"
  | "isNftFeatured";

export const FLAG_OVERRIDES: Record<string, FlagOverrides | undefined> = {
  isPinned: {
    active: {
      icon: <LuPin />,
      color: colors.bgHighlight,
      textColor: colors.textInverse,
    },
    inactive: {
      icon: <LuPinOff />,
      hide: true,
    },
  },
  isAccessible: {
    active: {
      icon: <LuMonitorCheck />,
    },
    inactive: {
      textColor: colors.textError,
      icon: <LuMonitorOff />,
      name: "Inaccessible",
    },
  },
  isListed: {
    active: {
      icon: <LuListChecks />,
    },
    inactive: {
      textColor: colors.textError,
      icon: <LuListX />,
      name: "Unlisted",
    },
  },
  isYoutubeSync: {
    active: {
      icon: <LuYoutube />,
    },
    inactive: {
      icon: <LuHardDriveUpload />,
      name: "Direct upload",
    },
  },
  hasNft: {
    active: {
      textColor: colors.textInverse,
      color: colors.bgHighlight,
      icon: <LuBadgeDollarSign />,
    },
    inactive: {
      icon: <LuCircleOff />,
      name: "No NFT",
      hide: true,
    },
  },
  isPublic: {
    active: {
      icon: <LuUsers />,
    },
    inactive: {
      textColor: colors.textError,
      icon: <LuUserX />,
      name: "Non-public",
    },
  },
  isExcluded: {
    active: {
      color: colors.bgError,
      icon: <LuEyeOff />,
    },
    inactive: {
      icon: <LuEye />,
      hide: true,
    },
  },
  isCensored: {
    active: {
      color: colors.bgError,
      icon: <LuMegaphoneOff />,
    },
    inactive: {
      hide: true,
      icon: <LuMegaphone />,
    },
  },
  isShort: {
    active: {
      icon: <LuTimer />,
    },
    inactive: {
      icon: <LuTimerOff />,
      hide: true,
    },
  },
  isShortDerived: {
    active: {
      icon: <LuRectangleVertical />,
    },
    inactive: {
      hide: true,
    },
  },
  isExplicit: {
    active: {
      color: colors.bgError,
      icon: <LuAlertCircle />,
    },
    inactive: {
      icon: <LuCircleOff />,
      hide: true,
    },
  },
  isNftFeatured: {
    active: {
      icon: <LuStar />,
    },
    inactive: {
      name: "Nft Not Featured",
      icon: <LuStarOff />,
    },
  },
} satisfies Record<Flag, FlagOverrides | undefined>;

export function getFlagProps(key: string, isActive?: boolean) {
  const overrides =
    FLAG_OVERRIDES[key]?.[isActive ? "active" : "inactive"] || {};
  const hide = overrides?.hide || false;
  const name =
    overrides?.name ||
    (!isActive ? "Not " : "") + _.startCase(key.replace(/^(is|has)/, ""));
  const color = overrides?.color || (isActive ? colors.bg0 : colors.bg1);
  const icon = overrides?.icon || (isActive ? <LuCheck /> : <LuX />);
  const textColor = overrides?.textColor || colors.textDefault;
  return { hide, name, color, icon, textColor };
}
