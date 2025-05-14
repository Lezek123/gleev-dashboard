import styled from "styled-components";
import { LuCheck, LuX } from "react-icons/lu";
import { colors, flexCenter } from "../../styles";

const Flag = styled.div<{ active: boolean }>`
  display: inline-flex;
  gap: 5px;
  border-radius: 10px;
  padding: 2px 5px;
  margin-right: 5px;
  background: ${(props) =>
    props.active ? `${colors.bgSuccess}` : `${colors.bgInactive}`};
`;

const FlagName = styled.div`
  font-size: 12px;
`;

const FlagValue = styled.div`
  ${flexCenter}
`;

type FlagsProps = {
  values: Record<string, boolean | null | undefined>;
  className?: string;
};

function Flags({ values, className }: FlagsProps) {
  return (
    <div className={className}>
      {Object.entries(values).map(([k, v]) => {
        k = k.replace(/^(is|has)/, "").toLowerCase();
        return (
          <Flag active={!!v} key={k}>
            <FlagName>{k}</FlagName>
            <FlagValue>{v ? <LuCheck /> : <LuX />}</FlagValue>
          </Flag>
        );
      })}
    </div>
  );
}

export default styled(Flags)``;
