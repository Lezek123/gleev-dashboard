import styled from "styled-components";
import { useState } from "react";
import _ from "lodash";
import DatePicker from "react-datepicker";
import { DatePickerFiled } from "../forms/Form.styles";
import { DEFAULT_FILTERS, Filters } from "../../helpers/video/filtering";
import { getTimezoneStr } from "../../utils";
import {
  Form,
  FormButton,
  FormField,
  FormGroup,
  Icon,
  Input,
} from "semantic-ui-react";
import { LanguageSelect } from "../forms/LanguageSelect";
import { VideoCategorySelect } from "../forms/VideoCategorySelect";
import { VideoBoolFilters } from "../forms/VideoBoolFilters";
import { colors } from "../../styles";

type VideoFiltersProps = {
  className?: string;
  currentFilters: Filters;
  onSubmit: (filters: Filters) => void;
};

function VideoFilters({
  className,
  onSubmit,
  currentFilters,
}: VideoFiltersProps) {
  const [filters, setFilters] = useState<Filters>({ ...currentFilters });
  return (
    <div className={className}>
      <Form
        style={{ background: colors.bg2, padding: 10, marginTop: 20 }}
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(filters);
        }}
      >
        <FormGroup widths={"equal"}>
          <FormField>
            <label>Video ID</label>
            <Input
              type="text"
              placeholder="Video ID"
              value={filters.videoId}
              onChange={(e) =>
                setFilters((f) => ({ ...f, videoId: e.target.value }))
              }
            />
          </FormField>
          <FormField>
            <label>Channel ID</label>
            <Input
              type="text"
              placeholder="Channel ID"
              value={filters.channelId}
              onChange={(e) =>
                setFilters((f) => ({ ...f, channelId: e.target.value }))
              }
            />
          </FormField>
        </FormGroup>
        <FormField>
          <label>Video category</label>
          <VideoCategorySelect
            placeholder="Video category"
            value={filters.categoryId}
            onChange={(value) =>
              setFilters((f) => ({ ...f, categoryId: value }))
            }
          />
        </FormField>
        <FormGroup widths={"equal"}>
          <FormField>
            <label>Language (specified)</label>
            <LanguageSelect
              placeholder="Language (specified)"
              value={filters.language}
              onChange={(value) =>
                setFilters((f) => ({ ...f, language: value }))
              }
            />
          </FormField>
          <FormField>
            <label>Language (detected)</label>
            <LanguageSelect
              placeholder="Language (detected)"
              value={filters.orionLanguage}
              onChange={(value) =>
                setFilters((f) => ({ ...f, orionLanguage: value }))
              }
            />
          </FormField>
        </FormGroup>
        <FormGroup widths="equal">
          <DatePickerFiled>
            <label>Uploaded after ({getTimezoneStr()})</label>
            <DatePicker
              showTimeSelect
              dateFormat={"yyyy/MM/dd hh:mm"}
              placeholderText={`Start date (${getTimezoneStr()})`}
              selected={filters.startDate}
              onChange={(date) =>
                setFilters((f) => ({ ...f, startDate: date }))
              }
            />
          </DatePickerFiled>
          <DatePickerFiled>
            <label>Uploaded before ({getTimezoneStr()})</label>
            <DatePicker
              showTimeSelect
              dateFormat={"yyyy/MM/dd hh:mm"}
              placeholderText={`End date (${getTimezoneStr()})`}
              selected={filters.endDate}
              onChange={(date) => setFilters((f) => ({ ...f, endDate: date }))}
            />
          </DatePickerFiled>
        </FormGroup>
        <FormField>
          <label>Title fragment</label>
          <Input
            icon="search"
            iconPosition="left"
            type="text"
            placeholder="Title fragment..."
            value={filters.titleFragment}
            onChange={(e) =>
              setFilters((filters) => ({
                ...filters,
                titleFragment: e.target.value,
              }))
            }
          />
        </FormField>
        <FormField>
          <VideoBoolFilters
            text="Properties"
            value={filters.flags}
            onChange={(v) =>
              setFilters((f) => ({
                ...f,
                flags: v as Filters["flags"],
              }))
            }
          />
        </FormField>
        {/* TODO: License */}
        <FormGroup>
          <FormField width={"12"}>
            <FormButton
              fluid
              primary
              type="submit"
              disabled={_.isEqual(currentFilters, filters)}
            >
              Apply filters
            </FormButton>
          </FormField>
          <FormField width={"4"}>
            <FormButton
              fluid
              onClick={() => setFilters({ ...DEFAULT_FILTERS })}
            >
              <Icon name="x" />
              Clear all
            </FormButton>
          </FormField>
        </FormGroup>
      </Form>
    </div>
  );
}

export default styled(VideoFilters)``;
