import {
  Dropdown,
  DropdownItemProps,
  Icon,
  Label,
  SemanticICONS,
} from "semantic-ui-react";
import _ from "lodash";
import { getFlagProps } from "../../helpers/video/flags";

export type VideoBoolFiltersProps = {
  text?: string;
  icon?: SemanticICONS;
  value: Record<string, boolean | null>;
  onChange: (value: Record<string, boolean | null>) => void;
};

function asOptions(value: Record<string, boolean | null>) {
  return Object.keys(value).flatMap((f): DropdownItemProps[] => {
    const activeProps = getFlagProps(f, true);
    const inactiveProps = getFlagProps(f, false);
    return [
      {
        value: `${f}-true`,
        text: activeProps.name,
        icon: <Icon>{activeProps.icon}</Icon>,
      },
      {
        value: `${f}-false`,
        text: inactiveProps.name,
        icon: <Icon>{inactiveProps.icon}</Icon>,
      },
    ];
  });
}

function asSelectedOptions(value: Record<string, boolean | null>) {
  return _.chain(value)
    .entries()
    .filter(([, v]) => v !== null)
    .sortBy(([, v]) => !v)
    .map(([k, v]) => `${k}-${String(v)}`)
    .valueOf();
}

function asFilters(value: Record<string, boolean | null>, options: string[]) {
  return Object.fromEntries([
    ...Object.keys(value).map((k) => [k, null]),
    ...options.map((o) => {
      const [k, v] = o.split("-");
      return [k, v === "true"];
    }),
  ]);
}

export function VideoBoolFilters({
  text,
  icon,
  value,
  onChange,
}: VideoBoolFiltersProps) {
  return (
    <Dropdown
      text={text || "Filters"}
      icon={icon || "filter"}
      fluid
      clearable
      labeled
      scrolling
      button
      multiple
      options={asOptions(value)}
      className="icon"
      value={asSelectedOptions(value)}
      onChange={(e, { value: selectedOptions }) => {
        onChange(asFilters(value, (selectedOptions || []) as string[]));
      }}
      renderLabel={(item) => {
        if (item.value) {
          const [k, v] = item.value.toString().split("-");
          const isActive = v === "true";
          const { icon, name } = getFlagProps(k, isActive);
          return (
            <Label basic>
              <Icon>{icon}</Icon>
              {name}
              <Icon
                name="delete"
                onClick={() => onChange({ ...value, [k]: null })}
              />
            </Label>
          );
        }
      }}
    />
  );
}
