import type { CodegenConfig } from "@graphql-codegen/cli";
import dotenv from "dotenv";

dotenv.config();

const graphql_url: string = process.env.VITE_GRAPHQL_API_URL || "";

const config: CodegenConfig = {
    overwrite: true,
    schema: graphql_url,
    // documents: "src/api/*.ts, src/api/*.tsx",
    generates: {
        "src/api/generated/": {
            preset: "client",
            plugins: [
                "typescript",
                "typescript-operations",
                "typescript-react-apollo",
            ],
            config: {
                withHooks: true,
                withComponent: false,
                withHOC: false,
                withRefetchFn: false,
            },
        },
    },
};

export default config;
