import { Dropdown } from "semantic-ui-react";
import langs from "iso-639-1";

type LanguageSelectProps = {
  onChange: (value: string) => void;
  value: string;
  placeholder?: string;
};

export function LanguageSelect({
  value,
  placeholder,
  onChange,
}: LanguageSelectProps) {
  return (
    <Dropdown
      clearable
      options={langs.getAllCodes().map((c) => ({
        key: c,
        value: c,
        text: langs.getName(c),
        label: c,
      }))}
      placeholder={placeholder}
      search
      selection
      fluid
      value={value}
      onChange={(e, { value }) => onChange(String(value || ""))}
    />
  );
}
