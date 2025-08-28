// Apollo Client removed from Dubai MVP - using REST API instead
// GraphQL functionality disabled for simplified deployment

// Mock exports for backwards compatibility
export const isLoggedInVar = {
    __typename: "MockVar",
    value: false
};

// Mock Apollo Client for components that still import it
export const client = {
    query: () => Promise.reject(new Error("GraphQL disabled - use REST API")),
    mutate: () => Promise.reject(new Error("GraphQL disabled - use REST API")),
    cache: {
        readQuery: () => null,
        writeQuery: () => {},
    }
};
