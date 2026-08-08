import React from 'react';
import styles from './TradingPlatform.module.css';

const MetricsDisplay = ({
  tokenBalance, investmentTotalValues, investmentTotalValuesPortfoliosOfPortfolios, totalAccountValue, mintTokens, accounts, goldPrice
}) => {
    return (
        <div>
            <div className={styles.containerWithLogo}>
                <div className={styles.metrics}>
                    <span>Token Balance: {parseFloat(tokenBalance).toFixed(2)} MTK</span>
                    <span>Total Investments Value: {investmentTotalValues.toFixed(2)} MTK</span>
                    <span>Total Stock Portfolio Value: {(investmentTotalValues + parseFloat(tokenBalance)).toFixed(2)} MTK</span>
                    <span>Total Investments in Portfolios Value: {investmentTotalValuesPortfoliosOfPortfolios.toFixed(2)} MTK</span>
                    <span>Total Account Value: {totalAccountValue.toFixed(3)} MTK</span>
                    <span>Current MTK Price: {goldPrice ? parseFloat(goldPrice).toFixed(2) : "Loading"} USD</span>
                    <button onClick={mintTokens} disabled={!accounts.length} className={styles.button}>Mint Tokens
                    </button>
                </div>
                <h1 className={styles.title}>MTK Platform</h1>
                <img src="MTKlogo.jpeg" alt="MTK Logo" className={styles.logo}/>
            </div>
        </div>
    );
};

export default MetricsDisplay;
