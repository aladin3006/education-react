import { Container } from 'react-bootstrap';
import React, { useEffect, useState, createContext } from 'react';
import ReactSwitch from "react-switch";

export const ThemeContext = createContext(null);

function DisplayVideo() {
    const [theme, setTheme] = useState("light");

    const toggleTheme = () => {
        setTheme((curr) => (curr === "light" ? "dark" : "light"));
    }
    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <Container className={theme === "dark" ? "bg-dark text-light" : "bg-light text-dark"}>
                <div>DisplayVideo</div>
                <div className="switch">
                    <label>{theme === "light" ? "Light Mode" : "Dark Mode"}</label>
                    <ReactSwitch onChange={toggleTheme} checked={theme === "dark"} />
                </div>
                <div className="ratio ratio-16x9">
                    {/* Use the embed URL instead of the regular video URL */}
                    <iframe
                        src="https://www.youtube.com/embed/Aici8GtJ_LM" // <-- Change the URL here
                        title="Youtube video"
                        allowFullScreen
                    ></iframe>
                </div>
            </Container>
        </ThemeContext.Provider>
    );
}

export default DisplayVideo;
