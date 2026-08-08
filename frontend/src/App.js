import React, { useState, useEffect } from 'react';
import detectEthereumProvider from '@metamask/detect-provider';
import Web3 from 'web3';
import { tokenAbi } from './abis/mytokenABI.js';
import PortfolioOfPortfoliosItem from './PortfolioOfPortfoliosItem';  // Import the new component
import styles from './TradingPlatform.module.css';
import StockItem from './StockItem';  // Adjust the path as necessary based on your file structure
import MetricsDisplay from './MetricsDisplay';  // Adjust the path if necessary
import CompleteTotalValuesDisplay from './CompleteTotalValuesDisplay'; // Import the new component

function App() {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [portfolio, setPortfolio] = useState({
    COIN1: { selected: false, investment: 0, quantity: 0, oldInvestment: 0, oldQuantity: 0, oldAveragePrice: 0 },
    COIN2: { selected: false, investment: 0, quantity: 0, oldInvestment: 0, oldQuantity: 0, oldAveragePrice: 0 },
    COIN3: { selected: false, investment: 0, quantity: 0, oldInvestment: 0, oldQuantity: 0, oldAveragePrice: 0 },
    COIN4: { selected: false, investment: 0, quantity: 0, oldInvestment: 0, oldQuantity: 0, oldAveragePrice: 0 },
    COIN5: { selected: false, investment: 0, quantity: 0, oldInvestment: 0, oldQuantity: 0, oldAveragePrice: 0 },
    COIN6: { selected: false, investment: 0, quantity: 0, oldInvestment: 0, oldQuantity: 0, oldAveragePrice: 0 },
    COIN7: { selected: false, investment: 0, quantity: 0, oldInvestment: 0, oldQuantity: 0, oldAveragePrice: 0 },
    COIN8: { selected: false, investment: 0, quantity: 0, oldInvestment: 0, oldQuantity: 0, oldAveragePrice: 0 },
    COIN9: { selected: false, investment: 0, quantity: 0, oldInvestment: 0, oldQuantity: 0, oldAveragePrice: 0 },
    COIN10: { selected: false, investment: 0, quantity: 0, oldInvestment: 0, oldQuantity: 0, oldAveragePrice: 0 }
  });
  const [isTransactionInProgress, setIsTransactionInProgress] = useState(false);
  const [portfolios, setPortfolios] = useState([]);
  const [portfolioOfPortfolios, setPortfolioOfPortfolios] = useState({
    "0x7b7Db5e1ca840b90d3e3B83fafF8DdFD0625D88d": { selected: false, investment: 0, quantity: 0, oldInvestment: 0, oldQuantity: 0, oldAveragePrice: 0 },
    "0x0a3A9CE84F4E6b8AeAE14d749F8FE74Ea175F77f": { selected: false, investment: 0, quantity: 0, oldInvestment: 0, oldQuantity: 0, oldAveragePrice: 0 },
    "0x6273d45398Bd315155c1ff7630dFb2b4Df216C5F": { selected: false, investment: 0, quantity: 0, oldInvestment: 0, oldQuantity: 0, oldAveragePrice: 0 },
    "0xb7aF901F62BA0A186a0eE991531FE8e8556D6749": { selected: false, investment: 0, quantity: 0, oldInvestment: 0, oldQuantity: 0, oldAveragePrice: 0 },
    "0xd92EAf1116Cd5BC8c28e36A36427d284a995F7C4": { selected: false, investment: 0, quantity: 0, oldInvestment: 0, oldQuantity: 0, oldAveragePrice: 0 }
  });
  const [portfoliosOfPortfolios, setPortfoliosOfPortfolios] = useState([]);
  const [tokenContract, setTokenContract] = useState(null);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [editingId, setEditingId] = useState(null);
  const [pendingUpdate, setPendingUpdate] = useState(null);
  const [prices, setPrices] = useState({});
  const [pricesPortfoliosOfPortfolios, setPricesPortfoliosOfPortfolios] = useState({});
  const [investmentTotalValues, setInvestmentTotalValues] = useState(0);
  const [investmentTotalValuesPortfoliosOfPortfolios, setInvestmentTotalValuesPortfoliosOfPortfolios] = useState(0);
  const [totalAccountValue, setTotalAccountValue] = useState(0);
  const [goldPrice, setGoldPrice] = useState('Loading...');  // Gold price state
  const apiBaseUrl = window.location.hostname === "localhost" ? "http://localhost:3001" : `http://${window.location.hostname}:3001`;
  const [showStockPortfolio, setShowStockPortfolio] = useState(true);
  const [showPortfolioOfPros, setShowPortfolioOfPros] = useState(true);
  const [showAllUserPortfolios, setShowAllUserPortfolios] = useState(true);

  useEffect(() => {
        const fetchPrices = async () => {
            try {
                const response = await fetch(`${apiBaseUrl}/prices`);
                const data = await response.json();
                console.log('Current Prices:', data);
                // Set the fetched prices in state
                setPrices(data);
            } catch (error) {
                console.error('Failed to fetch prices:', error);
            }
        };

        fetchPrices();
        const priceInterval = setInterval(fetchPrices, 5100); // Update prices every second

        return () => clearInterval(priceInterval); // Clean up on component unmount
  }, []);

  useEffect(() => {
        async function fetchGoldPrice() {
            try {
                const response = await fetch(`${apiBaseUrl}/scrapeGoldPrice`);
                const data = await response.json();
                setGoldPrice(data.price / 100);  // Assuming the price needs to be divided by 100
            } catch (error) {
                console.error('Failed to fetch gold price:', error);
                setGoldPrice('Error fetching price');
            }
        }
        fetchGoldPrice();
        const interval = setInterval(fetchGoldPrice, 5000);  // Update gold price every second
        return () => clearInterval(interval);  // Cleanup on unmount
  }, [apiBaseUrl]);

  useEffect(() => {
        const fetchPricesPortfoliosOfPortfolios = async () => {
            try {
                const response = await fetch(`${apiBaseUrl}/pricesPortfoliosOfPortfolios`);
                const data = await response.json();
                console.log('Current Prices:', data);
                // Set the fetched prices in state
                setPricesPortfoliosOfPortfolios(data);
            } catch (error) {
                console.error('Failed to fetch prices:', error);
            }
        };

        fetchPricesPortfoliosOfPortfolios();
        const priceInterval = setInterval(fetchPricesPortfoliosOfPortfolios, 1000); // Update prices every second

        return () => clearInterval(priceInterval); // Clean up on component unmount
  }, []);

  useEffect(() => {
    async function loadProviderAndData() {
      const provider = await detectEthereumProvider();
      if (!provider) {
        console.error('Please install MetaMask!');
        alert('Please install MetaMask to use this feature.');
        return;
      }

      try {
        await provider.request({ method: 'eth_requestAccounts' });
      } catch (error) {
        console.error('User denied account access', error);
        alert('You need to allow MetaMask access to use this feature.');
        return;
      }

      const web3Instance = new Web3(provider);
      const accounts = await web3Instance.eth.getAccounts();
      if (accounts.length === 0) {
        console.error("No accounts found.");
        alert('No Ethereum accounts found. Please ensure MetaMask is unlocked.');
        return;
      }

      const tokenInstance = new web3Instance.eth.Contract(tokenAbi, '0xD46805C615084b20aEe12D3c94793e29a7a33249');
      setWeb3(web3Instance);
      setAccounts(accounts);
      setTokenContract(tokenInstance);

      const balance = await tokenInstance.methods.balanceOf(accounts[0]).call();
      setTokenBalance(web3Instance.utils.fromWei(balance, 'ether'));

      fetchPortfolios(accounts[0]);
      fetchPortfoliosOfPortfolios(accounts[0]);
    }

    loadProviderAndData();
    },
  []);

  useEffect(() => {
    const totalInvestment = Object.keys(portfolio).reduce((acc, stock) => {
      return acc + (portfolio[stock].quantity * prices[stock] || 0);
    }, 0);
    const totalInvestmentPortfolioOfPortfolios = Object.keys(portfolioOfPortfolios).reduce((acc, stock) => {
      return acc + (portfolioOfPortfolios[stock].quantity * pricesPortfoliosOfPortfolios[stock]/100 || 0);
    }, 0);

    setInvestmentTotalValues(totalInvestment);
    setInvestmentTotalValuesPortfoliosOfPortfolios(totalInvestmentPortfolioOfPortfolios);
    const totalValue = parseFloat(tokenBalance) + totalInvestment + totalInvestmentPortfolioOfPortfolios;
    setTotalAccountValue(totalValue);
  }, [portfolio, prices, portfolioOfPortfolios, pricesPortfoliosOfPortfolios, tokenBalance]);

  // App.js
  const TransactionOverlay = () => (
    <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(69,41,41,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000 // Make sure it's on top of other elements
    }}>
        <div style={{
            padding: '20px',
            backgroundColor: 'white',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
        }}>
            Transaction in Progress...
        </div>
    </div>
);

  const fetchPortfolios = (account) => {
  fetch(`${apiBaseUrl}/portfolios?address=${account}`)
    .then(response => response.json())
    .then(data => {
      setPortfolios(data);
      const userPortfolio = data.find(p => p.address === account);
      if (userPortfolio) {
        handleEdit(userPortfolio);
      }
    })
    .catch(error => console.error('Error fetching portfolios:', error));
};

  const fetchPortfoliosOfPortfolios = (account) => {
  fetch(`${apiBaseUrl}/portfoliosOfPortfolios?address=${account}`)
    .then(response => response.json())
    .then(data => {
      setPortfoliosOfPortfolios(data);
      const userPortfolioOfPortfolios = data.find(p => p.address === account);
      if (userPortfolioOfPortfolios) {
        handleEditPortfolioOfPortfolios(userPortfolioOfPortfolios);
      }
    })
    .catch(error => console.error('Error fetching portfolios:', error));
};

  const handleEdit = (portfolioData) => {
  setEditingId(portfolioData.id);
  const currentSelections = portfolioData.portfolio;  // Assuming it's already properly parsed as an array

  let updatedSelections = {
    ...portfolio,
    COIN1: { selected: false, investment: 0, quantity: 0, oldInvestment: 0, oldQuantity: 0, oldAveragePrice: 0 },
    COIN2: { selected: false, investment: 0, quantity: 0, oldInvestment: 0, oldQuantity: 0, oldAveragePrice: 0 },
    COIN3: { selected: false, investment: 0, quantity: 0, oldInvestment: 0, oldQuantity: 0, oldAveragePrice: 0 },
    COIN4: { selected: false, investment: 0, quantity: 0, oldInvestment: 0, oldQuantity: 0, oldAveragePrice: 0 },
    COIN5: { selected: false, investment: 0, quantity: 0, oldInvestment: 0, oldQuantity: 0, oldAveragePrice: 0 },
    COIN6: { selected: false, investment: 0, quantity: 0, oldInvestment: 0, oldQuantity: 0, oldAveragePrice: 0 },
    COIN7: { selected: false, investment: 0, quantity: 0, oldInvestment: 0, oldQuantity: 0, oldAveragePrice: 0 },
    COIN8: { selected: false, investment: 0, quantity: 0, oldInvestment: 0, oldQuantity: 0, oldAveragePrice: 0 },
    COIN9: { selected: false, investment: 0, quantity: 0, oldInvestment: 0, oldQuantity: 0, oldAveragePrice: 0 },
    COIN10: { selected: false, investment: 0, quantity: 0, oldInvestment: 0, oldQuantity: 0, oldAveragePrice: 0 }
  };

  currentSelections.forEach(({ stock, price, quantity }) => {
    if (updatedSelections.hasOwnProperty(stock)) {
      const parsedPrice = parseFloat(price);
      const parsedQuantity = parseFloat(quantity);
      const parsedInvestment = parseFloat(price) * parseFloat(quantity);
      updatedSelections[stock] = {
        selected: false,
        investment: parsedInvestment,
        quantity: parsedQuantity,
        oldInvestment: parsedInvestment,
        oldQuantity: parsedQuantity,
        oldAveragePrice: parsedPrice  // Ensure there's no division by zero
      };
    }
  });

  setPortfolio(updatedSelections);
};

  const handleEditPortfolioOfPortfolios = (portfolioData) => {
  setEditingId(portfolioData.id);
  const currentSelections = portfolioData.portfolioOfPortfolios;  // Assuming it's already properly parsed as an array

  let updatedSelections = {...portfolioOfPortfolios};  // Copy the existing state correctly

  currentSelections.forEach(({ stock, quantity, price }) => {
      if (updatedSelections.hasOwnProperty(stock)) {
          const parsedPrice = parseFloat(price);
          const parsedQuantity = parseFloat(quantity);
          const parsedInvestment = parseFloat(price) * parseFloat(quantity);

          updatedSelections[stock] = {
              selected: false,
              investment: parsedInvestment,
              quantity: parsedQuantity,
              oldInvestment: parsedInvestment,
              oldQuantity: parsedQuantity,
              oldAveragePrice: parsedPrice
          };
      }
  });

  setPortfolioOfPortfolios(updatedSelections);
};

  const mintTokens = async () => {
    if (!accounts.length) {
        alert("No accounts detected. Please connect to MetaMask.");
        window.location.reload();
        return;
    }
    setIsTransactionInProgress(true); // Show overlay
    try {
        const response = await fetch(`${apiBaseUrl}/mintTokens`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ address: accounts[0] })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to mint tokens');

        alert(data.message); // Display the custom message from the server
        if (data.success) {
            const updatedBalance = await tokenContract.methods.balanceOf(accounts[0]).call();
            setTokenBalance(web3.utils.fromWei(updatedBalance, 'ether')); // Refetch the updated balance
            window.location.reload();
        }
    } catch (error) {
        console.error('Error minting tokens:', error);
        alert('Failed to mint tokens: ' + error.message);
        window.location.reload();
    }
    setIsTransactionInProgress(false); // Hide overlay
  };

  const toggleStock = (selectedStock) => {
    setPortfolio(prevPortfolio => {
        const newPortfolio = {};
        Object.keys(prevPortfolio).forEach(stock => {
            newPortfolio[stock] = {
                ...prevPortfolio[stock],
                selected: stock === selectedStock ? !prevPortfolio[stock].selected : false
            };
        });
        return newPortfolio;
    });
};

  const toggleStockPortfolioOfPortfolios = (selectedStock) => {
    setPortfolioOfPortfolios(prevPortfolio => {
        const newPortfolio = {};
        Object.keys(prevPortfolio).forEach(stock => {
            newPortfolio[stock] = {
                ...prevPortfolio[stock],
                selected: stock === selectedStock ? !prevPortfolio[stock].selected : false
            };
        });
        return newPortfolio;
    });
};

  const handleBuy = async (stock, amount) => {
    const investmentToAdd = parseFloat(amount);
    if (isNaN(investmentToAdd) || investmentToAdd <= 0) {
        alert("Please enter a valid amount to invest.");
        window.location.reload();
        return;
    }
    if (!portfolio[stock].selected) {
        alert("Please selected the stock first!");
        window.location.reload();
        return;
    }
    const currentPrice = prices[stock];
    const tokenAmount = investmentToAdd * currentPrice;

    setPendingUpdate(true);
    setIsTransactionInProgress(true); // Show overlay
    try {
        await tokenContract.methods.transfer('0x03eEfc6712f8626D4f4a9354AeA5c3733fAFed1d', web3.utils.toWei(tokenAmount.toString(), 'ether')).send({ from: accounts[0] });
        const newPortfolio = {
            ...portfolio,
            [stock]: {
                ...portfolio[stock],
                quantity: parseFloat(portfolio[stock].quantity) + investmentToAdd,
                investment: (parseFloat(portfolio[stock].investment) || 0) + investmentToAdd * currentPrice,
                price: currentPrice
            }
        };
        setPortfolio(newPortfolio);
        alert("Purchase successful!");
        await savePortfolioToServer(newPortfolio);
        window.location.reload();
    } catch (error) {
        console.error("Failed to buy stock:", error);
        alert("Transaction failed, reverting to previous state.");
        window.location.reload();
    }
    setPendingUpdate(false);
    setIsTransactionInProgress(false); // Show overlay
};

  const handleBuyPortfolioOfPortfolios = async (stock, amount) => {
    const investmentToAdd = parseFloat(amount);
    if (isNaN(investmentToAdd) || investmentToAdd <= 0) {
        alert("Please enter a valid amount to invest.");
        window.location.reload();
        return;
    }
    if (!portfolioOfPortfolios[stock].selected) {
        alert("Please selected the stock first!");
        window.location.reload();
        return;
    }
    const currentPrice = pricesPortfoliosOfPortfolios[stock]/100;
    const tokenAmount = investmentToAdd * currentPrice;

    setIsTransactionInProgress(true); // Show overlay
    setPendingUpdate(true);

    try {
        await tokenContract.methods.transfer('0x03eEfc6712f8626D4f4a9354AeA5c3733fAFed1d', web3.utils.toWei(0.9975*tokenAmount.toString(), 'ether')).send({ from: accounts[0] });
        await tokenContract.methods.transfer(stock, web3.utils.toWei(0.0025*tokenAmount.toString(), 'ether')).send({ from: accounts[0] });
        const newPortfolio = {
            ...portfolioOfPortfolios,
            [stock]: {
                ...portfolioOfPortfolios[stock],
                quantity: parseFloat(portfolioOfPortfolios[stock].quantity) + 0.995*investmentToAdd,
                investment: (parseFloat(portfolioOfPortfolios[stock].investment) || 0) + 0.995*investmentToAdd * currentPrice,
                price: currentPrice
            }
        };
        setPortfolioOfPortfolios(newPortfolio);
        alert("Purchase successful!");
        await savePortfolioToServerPortfolioOfPortfolios(newPortfolio);
        window.location.reload();
    } catch (error) {
        console.error("Failed to buy stock:", error);
        alert("Transaction failed, reverting to previous state.");
        window.location.reload();
    }
    setPendingUpdate(false);
    setIsTransactionInProgress(false); // Show overlay
};

  const handleSell = async (stock, amount) => {
    const investmentToSell = parseFloat(amount);
    if (isNaN(investmentToSell) || investmentToSell <= 0 || investmentToSell > portfolio[stock].quantity) {
        alert("Please enter a valid amount to sell.");
        window.location.reload();
        return;
    }
    if (!portfolio[stock].selected) {
        alert("Please selected the stock first!");
        window.location.reload();
        return;
    }

    const currentPrice = prices[stock];
    const tokenAmount = (investmentToSell * currentPrice).toString();

    setPendingUpdate(true);
    setIsTransactionInProgress(true); // Show overlay

    try {
        await fetch(`${apiBaseUrl}/sellTokens`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                address: accounts[0],
                amount: web3.utils.toWei(tokenAmount, 'ether')
            })
        });
        const newPortfolio = {
            ...portfolio,
            [stock]: {
                ...portfolio[stock],
                quantity: parseFloat(portfolio[stock].quantity) - investmentToSell,
                investment: (parseFloat(portfolio[stock].investment) || 0) - investmentToSell * currentPrice,
                price: currentPrice
            }
        };
        setPortfolio(newPortfolio);
        alert("Sale successful!");
        await savePortfolioToServer(newPortfolio);
        window.location.reload();
    } catch (error) {
        console.error('Error selling tokens:', error);
        alert('Transaction failed, reverting to previous state.');
        window.location.reload();
    }
    setPendingUpdate(false);
    setIsTransactionInProgress(false); // Show overlay
};

  const handleSellPortfolioOfPortfolios = async (stock, amount) => {
    const investmentToSell = parseFloat(amount);
    if (isNaN(investmentToSell) || investmentToSell <= 0 || investmentToSell > portfolioOfPortfolios[stock].quantity) {
        alert("Please enter a valid amount to sell.");
        window.location.reload();
        return;
    }
    if (!portfolioOfPortfolios[stock].selected) {
        alert("Please selected the stock first!");
        window.location.reload();
        return;
    }

    const currentPrice = pricesPortfoliosOfPortfolios[stock]/100;
    const tokenAmount = (investmentToSell * currentPrice).toString();

    setPendingUpdate(true);
    setIsTransactionInProgress(true); // Show overlay

    try {
        await fetch(`${apiBaseUrl}/sellTokens`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                address: accounts[0],
                amount: web3.utils.toWei(tokenAmount, 'ether')
            })
        });
        const newPortfolio = {
            ...portfolioOfPortfolios,
            [stock]: {
                ...portfolioOfPortfolios[stock],
                quantity: parseFloat(portfolioOfPortfolios[stock].quantity) - investmentToSell,
                investment: (parseFloat(portfolioOfPortfolios[stock].investment) || 0) - investmentToSell * currentPrice,
                price: currentPrice
            }
        };
        setPortfolioOfPortfolios(newPortfolio);
        alert("Sale successful!");
        await savePortfolioToServerPortfolioOfPortfolios(newPortfolio);
        window.location.reload();
    } catch (error) {
        console.error('Error selling tokens:', error);
        alert('Transaction failed, reverting to previous state.');
        window.location.reload();
    }
    setPendingUpdate(false);
    setIsTransactionInProgress(false); // Show overlay
};

  const savePortfolioToServer = async (portfolio) => {
    const portfolioArray = Object.entries(portfolio).map(([stock, {quantity, investment, selected}]) => ({
        stock,
        quantity,
        price: selected ? prices[stock] : (investment / quantity) || 0  // Use the current market price for transacted stock, retain calculated price for others
    }));

    try {
        const response = await fetch(`${apiBaseUrl}/portfolio`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                address: accounts[0],
                portfolio: portfolioArray
            })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to update portfolio');
        console.log('Portfolio updated successfully:', data);
        window.location.reload();
    } catch (error) {
        console.error('Error updating portfolio:', error);
        alert('Failed to update portfolio: ' + error.message);
        window.location.reload();
    }
};

  const savePortfolioToServerPortfolioOfPortfolios = async (portfolio) => {
    const portfolioArray = Object.entries(portfolio).map(([stock, {quantity, investment, selected}]) => ({
        stock,
        quantity,
        price: selected ? pricesPortfoliosOfPortfolios[stock]/100 : (investment / quantity) || 0  // Use the current market price for transacted stock, retain calculated price for others
    }));

    try {
        const response = await fetch(`${apiBaseUrl}/portfolioOfPortfolios`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                address: accounts[0],
                portfolioOfPortfolios: portfolioArray
            })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to update portfolio');
        console.log('Portfolio updated successfully:', data);
        window.location.reload();
    } catch (error) {
        console.error('Error updating portfolio:', error);
        alert('Failed to update portfolio: ' + error.message);
        window.location.reload();
    }
};

  const toggleStockPortfolio = () => setShowStockPortfolio(!showStockPortfolio);
  const togglePortfolioOfPros = () => setShowPortfolioOfPros(!showPortfolioOfPros);
  const toggleAllUserPortfolios = () => setShowAllUserPortfolios(!showAllUserPortfolios);

    return (
        <div className={styles.container}>
            {isTransactionInProgress && <TransactionOverlay/>}
            <MetricsDisplay
                tokenBalance={tokenBalance}
                investmentTotalValues={investmentTotalValues}
                investmentTotalValuesPortfoliosOfPortfolios={investmentTotalValuesPortfoliosOfPortfolios}
                totalAccountValue={totalAccountValue}
                mintTokens={mintTokens}
                accounts={accounts}
                goldPrice={goldPrice}
            />
            <h2>
                <button onClick={toggleStockPortfolio} className={styles.buttonHead2}>
                    {showStockPortfolio ? 'Your Stock Portfolio' : 'Your Stock Portfolio'}
                </button>
            </h2>
            {showStockPortfolio && (
                Object.keys(portfolio).map(stock => (
                    <StockItem key={stock} stock={stock} portfolio={portfolio} toggleStock={toggleStock}
                               handleBuy={handleBuy} handleSell={handleSell} prices={prices}/>
                ))
            )}

            <h2>
                <button onClick={togglePortfolioOfPros} className={styles.buttonHead2}>
                    {showPortfolioOfPros ? 'Your Portfolio of Pros' : 'Your Portfolio of Pros'}
                </button>
            </h2>
            {showPortfolioOfPros && (
                Object.keys(portfolioOfPortfolios).map(stock => (
                    <PortfolioOfPortfoliosItem key={stock} stock={stock} portfolio={portfolioOfPortfolios}
                                               toggleStock={toggleStockPortfolioOfPortfolios}
                                               handleBuy={handleBuyPortfolioOfPortfolios}
                                               handleSell={handleSellPortfolioOfPortfolios}
                                               prices={pricesPortfoliosOfPortfolios}/>
                ))
            )}

            <h2>
                <button onClick={toggleAllUserPortfolios} className={styles.buttonHead2}>
                    {showAllUserPortfolios ? 'Portfolios of all users' : 'Portfolios of all users'}
                </button>
            </h2>
            {showAllUserPortfolios && (
                <CompleteTotalValuesDisplay apiBaseUrl={apiBaseUrl}/>
            )}
            <h2 className={styles.subtitle}>Disclaimer: This platform was created after 80 hours of meaningful talking with ChatGPT without any prior React or Node.js experience</h2>
        </div>
    );
};

export default App;
