import React from 'react';
import styles from './TradingPlatform.module.css';

const PortfolioOfPortfoliosItem = ({ stock, portfolio, toggleStock, handleBuy, handleSell, prices }) => (
    <div key={stock} className={portfolio[stock].selected ? `${styles.portfolioItem} ${styles.selected}` : styles.portfolioItem}>
        <button className={styles.button} onClick={() => toggleStock(stock)}>{stock}</button>
        <input className={styles.input} type="number" placeholder="Quantity to Buy" onChange={(e) => handleBuy(stock, e.target.value)} />
        <input className={styles.input} type="number" placeholder="Quantity to Sell" onChange={(e) => handleSell(stock, e.target.value)} />
        <span className={styles.span}> Current Quantity: {(portfolio[stock].quantity || 0).toFixed(3)}</span>
        <span className={styles.span}> Invested Amount: {((portfolio[stock].quantity * portfolio[stock].oldAveragePrice) || 0).toFixed(3)}</span>
        <span className={styles.span}> Old Average Price: {(portfolio[stock].quantity === 0 ? 0 : (portfolio[stock].oldAveragePrice || 0)).toFixed(3)}</span>
        <span className={styles.span}> Current Price: {(prices[stock] ? prices[stock] / 100 : 0).toFixed(3)}</span>
        <span className={styles.span}> Current Value: {((portfolio[stock].quantity * prices[stock] / 100) || 0).toFixed(3)}</span>
    </div>
);

export default PortfolioOfPortfoliosItem;