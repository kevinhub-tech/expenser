import { useEffect, useState } from 'react';
import './ThemeChanger.css';

export default function ThemeSelector() {
    const [whiteMode, setWhiteMode] = useState(false);

    useEffect(() => {
        if (whiteMode) {
            document.body.setAttribute('data-theme', 'dark');
        } else {
            document.body.removeAttribute('data-theme');
        }

        // Cleanup function to ensure the class is removed when the component unmounts
        return () => {
            document.body.removeAttribute('data-theme');
        };

    }, [whiteMode])
    function handleTheme() {
        if (whiteMode) {
            setWhiteMode(false)
        } else {
            setWhiteMode(true)
        }
    };
    return (
        <section className="theme-picker">
            <div className="theme-switch-wrapper">
                {whiteMode ? (
                    <i className="fa fa-sun white"></i>
                ) : (
                    <i className="fa fa-sun"></i>
                )}
                <label className="theme-switch" for="checkbox">
                    <input type="checkbox" id="checkbox" />
                    <div className="slider round" onClick={handleTheme}></div>
                </label>
                {whiteMode ? (
                    <i className="fa fa-moon white"></i>
                ) : (
                    <i className="fa fa-moon"></i>
                )}

            </div>
        </section>
    )
}

