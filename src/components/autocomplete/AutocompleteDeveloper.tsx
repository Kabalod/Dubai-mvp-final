import React, { useMemo, useState } from "react";
import { t } from "@lingui/core/macro";
import { useLazyQuery } from "@apollo/client";
import { SEARCH_AUTOCOMPLETE_DEVELOPER } from "@/api/queries";
import { AutocompleteQueryVariables, AutocompleteResults } from "@/api/schema";
import { debounce } from "@/Utilities/utils";
import AutocompleteBase from "./AutocompleteBase";

export interface AutocompleteDeveloperProps {
    onValueChange: (obj: AutocompleteState) => void;
}

const AutocompleteDeveloper: React.FC<AutocompleteDeveloperProps> = ({
    onValueChange,
}) => {
    const [value, setValue] = useState("");

    const [getSearchResults, { data, loading, error }] = useLazyQuery<
        AutocompleteResults,
        AutocompleteQueryVariables
    >(SEARCH_AUTOCOMPLETE_DEVELOPER);

    const debouncedSearch = useMemo(
        () =>
            debounce((value: string) => {
                getSearchResults({ variables: { search: value } });
            }, 400),
        [getSearchResults]
    );

    const onSearch = (value: string) => {
        setValue(value);
        debouncedSearch(value);
        onValueChange({
            id: undefined,
            type: undefined,
            value,
        });
    };

    const options = useMemo<AutocompleteOption[]>(() => {
        if (!data) return [];
        // data.entities is (AreaType | BuildingType | ProjectType)[]
        const areas = data.autocomplete.areas.map((a) => ({
            id: a.areaIdx?.toString(),
            value: a.nameEn,
            type: "area" as SearchEntityType,
        }));
        const buildings = data.autocomplete.buildings.map((b) => ({
            id: b.buildingNumber,
            value: b.nameEn,
            type: "building" as SearchEntityType,
        }));
        const projects = data.autocomplete.projects.map((p) => ({
            id: p.id?.toString(),
            value: p.nameEn,
            type: "project" as SearchEntityType,
        }));
        const ret = areas.concat(buildings).concat(projects);

        return ret;
    }, [data]);

    const onSelect = (value: string, option: AutocompleteOption) => {
        setValue(value);
        onValueChange({
            id: option.id,
            type: option.type,
            value: option.value,
        });
    };

    const onBlur = () => {};

    return (
        <AutocompleteBase
            placeholder={t({
                id: "autocomplete.developer.placeholder",
                message: `Developer`,
            })}
            options={options}
            onSearch={onSearch}
            onSelect={onSelect}
            value={value}
            onBlur={onBlur}
        />
    );
};

export default AutocompleteDeveloper;
