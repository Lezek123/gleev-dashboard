import styled from "styled-components";
import {
  LuAlertOctagon,
  LuBadgeDollarSign,
  LuCheck,
  LuEyeOff,
  LuHardDriveUpload,
  LuImage,
  LuImageOff,
  LuListChecks,
  LuListX,
  LuMegaphoneOff,
  LuPin,
  LuRectangleVertical,
  LuTimer,
  LuUsers,
  LuUserX,
  LuX,
  LuYoutube,
} from "react-icons/lu";
import { colors } from "../../styles";
import { Icon, Label } from "semantic-ui-react";

type FlagStateOverrides = {
  hide?: boolean;
  color?: string;
  textColor?: string;
  icon?: React.ReactNode;
  name?: string;
};

type FlagOverrides = {
  active?: FlagStateOverrides;
  inactive?: FlagStateOverrides;
};

type FlagsProps = {
  values: Record<string, boolean | null | undefined>;
  className?: string;
};

const FLAG_OVERRIDES: Record<string, FlagOverrides> = {
  isPinned: {
    active: {
      icon: <LuPin />,
      color: colors.bgHighlight,
      textColor: colors.textInverse,
    },
    inactive: {
      hide: true,
    },
  },
  isAccessible: {
    active: {
      icon: <LuImage />,
    },
    inactive: {
      textColor: colors.textError,
      icon: <LuImageOff />,
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
    },
  },
  isShort: {
    active: {
      icon: <LuTimer />,
    },
    inactive: {
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
      icon: <LuAlertOctagon />,
    },
    inactive: {
      hide: true,
    },
  },
};

function Flags({ values, className }: FlagsProps) {
  return (
    <div className={className}>
      {Object.entries(values).map(([key, isActive]) => {
        const overrides = FLAG_OVERRIDES[key][isActive ? "active" : "inactive"];
        const hide = overrides?.hide || false;
        const name = overrides?.name || key.replace(/^(is|has)/, "");
        const color = overrides?.color || (isActive ? colors.bg0 : colors.bg1);
        const icon = overrides?.icon || (isActive ? <LuCheck /> : <LuX />);
        const textColor = overrides?.textColor || colors.textDefault;
        if (hide) {
          return null;
        }
        return (
          <Label style={{ background: color, color: textColor }} size="tiny">
            <Icon>{icon}</Icon>
            {name}
          </Label>
        );
      })}
    </div>
  );
}

export default styled(Flags)``;
