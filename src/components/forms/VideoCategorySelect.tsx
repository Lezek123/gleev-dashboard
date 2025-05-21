import { Dropdown } from "semantic-ui-react";
import { useQuery } from "@apollo/client";
import { VideoCategoriesDocument } from "../../__generated__/graphql";

type VideoCategorySelectProps = {
  onChange: (value: string) => void;
  value: string;
  placeholder?: string;
};

export function VideoCategorySelect({
  value,
  placeholder,
  onChange,
}: VideoCategorySelectProps) {
  const { data, loading } = useQuery(VideoCategoriesDocument);
  return (
    <Dropdown
      clearable
      loading={loading}
      options={data?.videoCategories.map((c) => ({
        key: c.id,
        value: c.id,
        text: c.name || "Unnamed category",
        label: c.id,
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
