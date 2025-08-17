import React, { useState } from "react";
import { changeLanguage } from "@/main";

const languages = {
    en: "English",
    ru: "Русский",
    de: "Deutsch",
};

const LanguageSwitcher: React.FC = () => {
    const [language, setLanguage] = useState("en");
    
    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newLanguage = e.target.value;
        setLanguage(newLanguage);
        changeLanguage(newLanguage);
        console.log("Language changed to:", newLanguage);
    };

    return (
        <div>
            <label style={{ marginRight: "10px" }}>Выберите язык:</label>
            <select
                value={language}
                onChange={handleLanguageChange}
                style={{ 
                    margin: "10px 0", 
                    padding: "5px", 
                    borderRadius: "4px",
                    border: "1px solid #ccc"
                }}
            >
                {Object.entries(languages).map(([code, name]) => (
                    <option key={code} value={code}>
                        {name}
                    </option>
                ))}
            </select>
            <p style={{ fontSize: "14px", color: "#666", marginTop: "5px" }}>
                Текущий язык: {languages[language as keyof typeof languages]}
            </p>
        </div>
    );
};

export default LanguageSwitcher;
