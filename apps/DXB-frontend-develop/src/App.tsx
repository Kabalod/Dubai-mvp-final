import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Routes from "@/modules/routes";
import Header from "@/components/header/Header";
import PageLayout from "@/components/layout/PageLayout";

function App() {
    return (
        <Router>
            <Header />
            <PageLayout>
                <Routes />
            </PageLayout>
        </Router>
    );
}

export default App;
