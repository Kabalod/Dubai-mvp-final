import {
    ApolloClient,
    InMemoryCache,
    createHttpLink,
    makeVar,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
    uri:
        import.meta.env.VITE_GRAPHQL_API_URL || "http://localhost:8000/graphql",
});

const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem("token");
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        },
    };
});

export const isLoggedInVar = makeVar<boolean>(false);

export const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
});
