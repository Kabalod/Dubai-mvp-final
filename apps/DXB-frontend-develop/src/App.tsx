import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ApolloProvider } from "@apollo/client";
import { client } from "@/api/client";
import Routes from "@/modules/routes";
import Header from "@/components/header/Header";
import PageLayout from "@/components/layout/PageLayout";

function App() {
    return (
        <ApolloProvider client={client}>
            <Router>
                <Header />
                <PageLayout>
                    <Routes />
                </PageLayout>
            </Router>
        </ApolloProvider>
    );
}

export default App;
