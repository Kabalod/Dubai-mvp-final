import {
    ApolloClient,
    InMemoryCache,
    createHttpLink,
    makeVar,
} from "@apollo/client";
import { GRAPHQL_API_URL } from "@/config";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
    uri: GRAPHQL_API_URL,
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
