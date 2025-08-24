import styles from "./MainFilters.module.scss";
import { Flex, Row, Segmented } from "antd";
import { useEffect, useState, useCallback } from "react";
import { Ordering, TransactionTypeEnum } from "@/api/schema";
import { Trans } from "@lingui/react/macro";
import {
    IMainQuery,
    MainFilterProps,
    PropertyComponentsOption,
    PeriodOption,
    Periods,
    PropertyComponents,
    TransactionTypeOption,
} from "./typings";
import DropdownMenu, { MoreDropdown } from "../DropdownMenu/DropdownMenu";
import AutocompleteBuilding from "../autocomplete/AutocompleteBuilding";
import CustomSelect from "@/components/CustomSelect/CustomSelect";
import CustomButton from "@/components/CustomButton/CustomButton";
import "@/styles/custom-buttons.scss";

const propertyComponentsOptions: Array<PropertyComponentsOption> = [
    { value: "Studio", label: "Studio" },
    { value: "1 B/R", label: "1 B/R" },
    { value: "2 B/R", label: "2 B/R" },
    { value: "3 B/R", label: "3 B/R" },
    { value: "4 B/R", label: "4+ B/R" },
];

const transactionsTypeOptions: Array<TransactionTypeOption> = [
    { value: "SALE", label: "Sales" },
    { value: "RENT", label: "Rental" },
];

const periodOptions: Array<PeriodOption> = [
    { value: "1 week", label: "1 week" },
    { value: "1 month", label: "1 month" },
    { value: "3 months", label: "3 months" },
    { value: "6 months", label: "6 months" },
    { value: "1 year", label: "1 year" },
    { value: "2 years", label: "2 years" },
    { value: "YTD", label: "YTD" },
];

export const initialQueryState: IMainQuery = {
    transactionType: "SALE",
    searchSubstring: "",
    propertyComponents: [],
    periods: "1 month",
    offset: 0,
    limit: 100,
    sorting: Ordering.Desc,
};

const MainFilters: React.FC<MainFilterProps> = ({ onSearch }) => {
    const [filtersState, setFiltersState] =
        useState<IMainQuery>(initialQueryState);

    const handleTransactionTypeChange = (val: TransactionTypeEnum) => {
        const nextVal: IMainQuery = {
            ...filtersState,
            transactionType: val,
        };
        setFiltersState(nextVal);
        onSearch(nextVal);
    };

    const handlePropertyComponentsChange = (val: PropertyComponents[]) => {
        const nextVal: IMainQuery = {
            ...filtersState,
            propertyComponents: val,
        };
        setFiltersState(nextVal);
    };

    const handleSearchValue = (obj: AutocompleteState) => {
        const nextVal: IMainQuery = {
            ...filtersState,
            searchSubstring: obj.value,
        };
        setFiltersState(nextVal);
    };

    const handlePeriodChange = (period: Periods) => {
        const nextVal: IMainQuery = {
            ...filtersState,
            periods: period,
        };
        setFiltersState(nextVal);
        onSearch(nextVal);
    };

    const handleSearch = useCallback(() => {
        onSearch(filtersState);
    }, [filtersState, onSearch]);

    useEffect(() => {
        // Инициализация фильтров при монтировании
        onSearch(initialQueryState);
    }, [onSearch]);

    return (
        <section className={styles.container}>
            <Row className={styles.midsection}>
                <Flex gap="small" className={styles.firstRow}>
                    <Segmented
                        options={transactionsTypeOptions}
                        className={styles.segments}
                        value={filtersState.transactionType}
                        onChange={(val) =>
                            handleTransactionTypeChange(
                                val as TransactionTypeEnum
                            )
                        }
                    />
                    <AutocompleteBuilding onValueChange={handleSearchValue} />
                    <CustomSelect
                        allowClear
                        onChange={handlePropertyComponentsChange}
                        mode="multiple"
                        placeholder="Bedrooms"
                        options={propertyComponentsOptions}
                        className={styles.selectProperty}
                    />
                    <DropdownMenu
                        content={
                            <MoreDropdown
                                onStateChange={() =>
                                    console.log("state change")
                                }
                            />
                        }
                    />
                    <CustomButton
                        shape="round"
                        onClick={handleSearch}
                        className={styles.searchButton}
                        variant="primary"
                    >
                        <Trans id="filters.search">SEARCH</Trans>
                    </CustomButton>
                </Flex>
            </Row>
            <Row className={styles.lastRow}>
                <Flex gap={"small"}>
                    {periodOptions.map((period) => (
                        <CustomButton
                            shape="round"
                            className={styles.periodButton}
                            onClick={() => handlePeriodChange(period.value)}
                            variant={
                                period.value === filtersState.periods
                                    ? "primary"
                                    : "outline"
                            }
                            key={period.value}
                        >
                            {period.label}
                        </CustomButton>
                    ))}
                </Flex>
            </Row>
        </section>
    );
};

export default MainFilters;
