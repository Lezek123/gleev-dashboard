import {
  Dropdown,
  DropdownItemProps,
  Icon,
  Label,
  SemanticICONS,
} from "semantic-ui-react";
import _ from "lodash";

export type VideoBoolFiltersProps = {
  text?: string;
  icon?: SemanticICONS;
  value: Record<string, boolean | null>;
  onChange: (value: Record<string, boolean | null>) => void;
};

function asOptions(value: Record<string, boolean | null>) {
  return Object.keys(value).flatMap((f): DropdownItemProps[] => [
    {
      value: `${f}-true`,
      text: `${_.startCase(f.replace(/^(is|has)/, ""))}`,
      icon: "check",
    },
    {
      value: `${f}-false`,
      text: `${_.startCase(f.replace(/^(is|has)/, ""))}`,
      icon: "x",
    },
  ]);
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
          return (
            <Label basic color={v === "true" ? "green" : "red"}>
              <Icon name={item.icon as SemanticICONS} />
              {item.text}
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
