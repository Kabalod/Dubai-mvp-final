import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ApolloProvider } from "@apollo/client";
import { client } from "@/api/client";
import { AuthProvider } from "@/contexts/AuthContext";
import Routes from "@/modules/routes";
import Header from "@/components/header/Header";
import PageLayout from "@/components/layout/PageLayout";

function App() {
    return (
        <ApolloProvider client={client}>
            <AuthProvider>
                <Router>
                    <Header />
                    <PageLayout>
                        <Routes />
                    </PageLayout>
                </Router>
            </AuthProvider>
        </ApolloProvider>
    );
}

export default App;
