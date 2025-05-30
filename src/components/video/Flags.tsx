import styled from "styled-components";
import { getFlagProps } from "../../helpers/video/flags";
import { flexCenter } from "../../styles";

type FlagsProps = {
  values: Record<string, boolean | null | undefined>;
  className?: string;
};

const Flag = styled.div`
  display: inline-flex;
  align-items: flex-end;
  gap: 5px;
  padding: 3px 10px;
  margin-right: 5px;
  font-size: 10px;
  font-weight: bold;
`;
const FlagIcon = styled.div`
  font-size: 12px;
  ${flexCenter}
`;

function Flags({ values, className }: FlagsProps) {
  return (
    <div className={className}>
      {Object.entries(values).map(([key, isActive]) => {
        const { hide, name, color, icon, textColor } = getFlagProps(
          key,
          !!isActive
        );
        if (hide) {
          return null;
        }
        return (
          <Flag key={key} style={{ background: color, color: textColor }}>
            <FlagIcon>{icon}</FlagIcon>
            {name}
          </Flag>
        );
      })}
    </div>
  );
}

export default styled(Flags)``;
