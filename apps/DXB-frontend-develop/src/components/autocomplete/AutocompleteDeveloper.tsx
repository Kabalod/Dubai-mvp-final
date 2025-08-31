import React, { useState } from "react";
import { t } from "@lingui/core/macro";
// Apollo Client удален - используем REST API
import AutocompleteBase from "./AutocompleteBase";

export interface AutocompleteDeveloperProps {
    onValueChange: (obj: AutocompleteState) => void;
}

const AutocompleteDeveloper: React.FC<AutocompleteDeveloperProps> = ({
    onValueChange,
}) => {
    const [value, setValue] = useState("");

    // Apollo Client удален - заглушка компонента
    const onSearch = (inputValue: string) => {
        setValue(inputValue);
        onValueChange({
            id: undefined,
            type: undefined,
            value: inputValue,
        });
        // TODO: Реализовать поиск через REST API
    };

    const onSelect = (selectedValue: string, option: any) => {
        setValue(selectedValue);
        onValueChange({
            id: option?.id,
            type: option?.type,
            value: selectedValue,
        });
    };

    const onBlur = () => {};

    return (
        <AutocompleteBase
            placeholder={t({
                id: "autocomplete.developer.placeholder",
                message: `Developer`,
            })}
            options={[]} // Пустые результаты до реализации REST API
            onSearch={onSearch}
            onSelect={onSelect}
            value={value}
            onBlur={onBlur}
        />
    );
};

export default AutocompleteDeveloper;