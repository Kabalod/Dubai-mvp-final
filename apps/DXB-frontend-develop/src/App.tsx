import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Routes from "@/modules/routes";
import Header from "@/components/header/Header";

function App() {
    return (
        <Router>
            <Header />
            <Routes />
        </Router>
    );
}

export default App;
