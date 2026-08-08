import React, { useState, useEffect } from 'react';
import styles from './TradingPlatform.module.css';  // Ensure the path to the CSS module is correct

const CompleteTotalValuesDisplay = ({ apiBaseUrl }) => {
    const [completeTotalValues, setCompleteTotalValues] = useState([]);

    useEffect(() => {
        const fetchCompleteTotalValues = async () => {
            try {
                const response = await fetch(`${apiBaseUrl}/completeTotalValues`);
                const data = await response.json();
                setCompleteTotalValues(data);
            } catch (error) {
                console.error('Failed to fetch complete total values:', error);
            }
        };

        fetchCompleteTotalValues();
        const interval = setInterval(fetchCompleteTotalValues, 1000);  // Set the interval to fetch data every second

        return () => clearInterval(interval);  // Clean up the interval on component unmount
    }, [apiBaseUrl]);

    return (
        <div>
            {completeTotalValues.map((value, index) => {
                const performance = ((value.completeTotalValue - 100)).toFixed(2);
                const performanceColor = performance > 0 ? 'green' : performance < 0 ? 'red' : performance === 0 ? 'gray' : 'black'; // added check for exact zero
                return (
                    <div key={index} className={styles.portfolioItem} style={{ color: performanceColor }}>
                        <span className={styles.span}>{value.address}</span>
                        <span className={styles.span}>{performance > 0 ? `+${performance}%` : `${performance}%`}</span>
                    </div>
                );
            })}
        </div>
    );
};

export default CompleteTotalValuesDisplay;