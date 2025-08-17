import { gql } from "@apollo/client";

export const GET_TRANSACTIONS = gql`
    query SearchTransactions(
        $transactionType: String!
        $searchSubstring: String
        $propertyComponents: [String!]
        $periods: String
        $sorting: Ordering
        $offset: Int!
        $limit: Int!
    ) {
        searchTransactions(
            transactionType: $transactionType
            searchSubstring: $searchSubstring
            propertyComponents: $propertyComponents
            periods: $periods
            order: { dateOfTransaction: $sorting }
            pagination: { offset: $offset, limit: $limit }
        ) {
            __typename
            results {
                id
                areaNameEn
                roomsEn
                actualWorth
                meterSalePrice
                developerNameEn
                dealYear
                dateOfTransaction
                buildingName
                locationName
                sqm
                roi
            }
            pageInfo {
                offset
                limit
            }
            totalCount
        }
    }
`;

export const GET_AGGREGATIONS = gql`
    query getAggregations(
        $searchSubstring: String
        $transactionType: String!
        $propertyComponents: [String!]
        $periods: [String!]
    ) {
        getAggregations(
            transactionType: $transactionType
            searchSubstring: $searchSubstring
            propertyComponents: $propertyComponents
            periods: $periods
        ) {
            __typename
            ... on AggregationResultType {
                totalBuildings
                totalDeals
                totalProperties
                growthDynamicPercent
                averagePrice {
                    comparison
                    dynamic
                    range
                    value
                    versus
                }
                averagePricePerSQM {
                    comparison
                    dynamic
                    range
                    value
                    versus
                }
                deals {
                    comparison
                    dynamic
                    range
                    value
                    versus
                }
                dealsVolume {
                    comparison
                    dynamic
                    range
                    value
                    versus
                }
                liquidity {
                    comparison
                    dynamic
                    range
                    value
                    versus
                }
                medianPrice {
                    comparison
                    dynamic
                    range
                    value
                    versus
                }
                priceRange {
                    comparison
                    dynamic
                    range
                    value
                    versus
                }
                roi {
                    comparison
                    dynamic
                    range
                    value
                    versus
                }
            }
        }
    }
`;

export const SEARCH_AUTOCOMPLETE_BUILDING = gql`
    query Autocomplete($search: String!) {
        autocomplete(search: $search) {
            __typename
            areas {
                id
                nameEn
            }
            buildings {
                id
                buildingNumber
                nameEn
            }
            projects {
                id
                projectNumber
                englishName
            }
        }
    }
`;
export const SEARCH_AUTOCOMPLETE_DEVELOPER = gql`
    query Autocomplete($search: String!) {
        autocomplete(search: $search) {
            __typename
            areas {
                id
                nameEn
            }
            buildings {
                id
                buildingNumber
                nameEn
            }
            projects {
                id
                projectNumber
                englishName
            }
        }
    }
`;
