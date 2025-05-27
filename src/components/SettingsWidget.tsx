import { useState } from "react";
import { LuSettings, LuX } from "react-icons/lu";
import styled from "styled-components";
import _ from "lodash";
import { Input, FormField, Button, Icon, Form } from "semantic-ui-react";
import { colors } from "../styles";

type SettingsWidgetProps = {
  className?: string;
  currentSettings: Settings;
  onSubmit: (settings: Settings) => void;
};

export type Settings = {
  gleevOperatorKey?: string;
};

const SettingsBox = styled.div`
  margin: 5px;
  padding: 10px;
  background: ${colors.bg3};
`;

export function SettingsWidget({
  className,
  currentSettings,
  onSubmit,
}: SettingsWidgetProps) {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<Settings>({ ...currentSettings });
  return (
    <div className={className}>
      <Button onClick={() => setOpen((o) => !o)} icon size="big">
        <Icon>{open ? <LuX /> : <LuSettings />}</Icon>
      </Button>
      {open && (
        <SettingsBox>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit(settings);
            }}
          >
            <FormField>
              <label>Gleev operator key</label>
              <Input
                placeholder="Gleev operator key"
                value={settings.gleevOperatorKey}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    gleevOperatorKey: e.target.value,
                  }))
                }
              />
            </FormField>
            <Button disabled={_.isEqual(currentSettings, settings)} fluid>
              Update
            </Button>
          </Form>
        </SettingsBox>
      )}
    </div>
  );
}

export default styled(SettingsWidget)`
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding: 10px;
  top: 0;
  right: 0;
  z-index: 1;
`;
