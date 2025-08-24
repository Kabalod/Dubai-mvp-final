import styles from "./MainFilters.module.scss";
import { Flex, Row, Segmented, InputNumber, Space, Collapse } from "antd";
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

// Расширенные опции фильтрации
const propertyTypeOptions = [
    { value: "apartment", label: "Apartment" },
    { value: "villa", label: "Villa" },
    { value: "townhouse", label: "Townhouse" },
    { value: "penthouse", label: "Penthouse" },
    { value: "office", label: "Office" },
    { value: "land", label: "Land" },
];

const areaOptions = [
    { value: "downtown", label: "Downtown Dubai" },
    { value: "marina", label: "Dubai Marina" },
    { value: "jbr", label: "JBR" },
    { value: "palm", label: "Palm Jumeirah" },
    { value: "business_bay", label: "Business Bay" },
    { value: "difc", label: "DIFC" },
    { value: "jumeirah", label: "Jumeirah" },
    { value: "deira", label: "Deira" },
];

const priceRanges = [
    { value: "0-500000", label: "Under 500K AED" },
    { value: "500000-1000000", label: "500K - 1M AED" },
    { value: "1000000-2000000", label: "1M - 2M AED" },
    { value: "2000000-5000000", label: "2M - 5M AED" },
    { value: "5000000-10000000", label: "5M - 10M AED" },
    { value: "10000000+", label: "10M+ AED" },
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
    // Новые поля фильтров
    propertyType: "",
    area: "",
    priceRange: "",
    minPrice: null,
    maxPrice: null,
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

    // Новые обработчики для расширенных фильтров
    const handlePropertyTypeChange = (value: string) => {
        const nextVal: IMainQuery = { ...filtersState, propertyType: value };
        setFiltersState(nextVal);
    };

    const handleAreaChange = (value: string) => {
        const nextVal: IMainQuery = { ...filtersState, area: value };
        setFiltersState(nextVal);
    };

    const handlePriceRangeChange = (value: string) => {
        const nextVal: IMainQuery = { ...filtersState, priceRange: value };
        setFiltersState(nextVal);
    };

    const handleMinPriceChange = (value: number | null) => {
        const nextVal: IMainQuery = { ...filtersState, minPrice: value };
        setFiltersState(nextVal);
    };

    const handleMaxPriceChange = (value: number | null) => {
        const nextVal: IMainQuery = { ...filtersState, maxPrice: value };
        setFiltersState(nextVal);
    };

    const handleClearFilters = () => {
        setFiltersState(initialQueryState);
        onSearch(initialQueryState);
    };

    const getActiveFiltersCount = () => {
        let count = 0;
        if (filtersState.propertyComponents.length > 0) count++;
        if (filtersState.propertyType) count++;
        if (filtersState.area) count++;
        if (filtersState.priceRange) count++;
        if (filtersState.minPrice || filtersState.maxPrice) count++;
        if (filtersState.searchSubstring) count++;
        return count;
    };

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

                {/* Расширенные фильтры */}
                <Collapse 
                    className={styles.expandableFilters}
                    bordered={false}
                    items={[
                        {
                            key: 'advanced',
                            label: (
                                <Space>
                                    <Trans id="filters.advanced">Advanced Filters</Trans>
                                    {getActiveFiltersCount() > 0 && (
                                        <span className={styles.filterCount}>
                                            ({getActiveFiltersCount()} active)
                                        </span>
                                    )}
                                </Space>
                            ),
                            children: (
                                <div className={styles.advancedFiltersContent}>
                                    <Row gutter={[16, 16]}>
                                        <div className={styles.filterRow}>
                                            <label>Property Type:</label>
                                            <CustomSelect
                                                placeholder="Select property type"
                                                allowClear
                                                value={filtersState.propertyType || undefined}
                                                onChange={handlePropertyTypeChange}
                                                options={propertyTypeOptions}
                                                className={styles.selectProperty}
                                            />
                                        </div>
                                        <div className={styles.filterRow}>
                                            <label>Area:</label>
                                            <CustomSelect
                                                placeholder="Select area"
                                                allowClear
                                                value={filtersState.area || undefined}
                                                onChange={handleAreaChange}
                                                options={areaOptions}
                                                className={styles.selectProperty}
                                            />
                                        </div>
                                        <div className={styles.filterRow}>
                                            <label>Price Range:</label>
                                            <CustomSelect
                                                placeholder="Select price range"
                                                allowClear
                                                value={filtersState.priceRange || undefined}
                                                onChange={handlePriceRangeChange}
                                                options={priceRanges}
                                                className={styles.selectProperty}
                                            />
                                        </div>
                                        <div className={styles.filterRow}>
                                            <label>Custom Price Range (AED):</label>
                                            <Space>
                                                <InputNumber
                                                    placeholder="Min"
                                                    value={filtersState.minPrice}
                                                    onChange={handleMinPriceChange}
                                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                    parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                                                    style={{ width: 120 }}
                                                />
                                                <span>—</span>
                                                <InputNumber
                                                    placeholder="Max"
                                                    value={filtersState.maxPrice}
                                                    onChange={handleMaxPriceChange}
                                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                    parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                                                    style={{ width: 120 }}
                                                />
                                            </Space>
                                        </div>
                                    </Row>
                                    
                                    <div className={styles.filterActions}>
                                        <CustomButton 
                                            onClick={handleClearFilters}
                                            variant="secondary"
                                        >
                                            <Trans id="filters.clear">Clear All</Trans>
                                        </CustomButton>
                                        <CustomButton 
                                            onClick={handleSearch}
                                            variant="primary"
                                        >
                                            <Trans id="filters.apply">Apply Filters</Trans>
                                        </CustomButton>
                                    </div>
                                </div>
                            )
                        }
                    ]}
                />
            </section>
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
