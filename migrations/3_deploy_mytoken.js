// migrations/3_deploy_mytoken.js
const { deployProxy } = require('@openzeppelin/truffle-upgrades');
const MyToken = artifacts.require("MyToken");
await new Promise(resolve => setTimeout(resolve, 10000));

module.exports = async function (deployer) {
    await new Promise(resolve => setTimeout(resolve, 10000)); // 10-second delay
    const initialSupply = web3.utils.toWei('1000000', 'ether');
    console.log('Starting deployment...');
    await deployProxy(MyToken, [initialSupply], { deployer, initializer: 'initialize' });
    console.log('Deployment finished. Waiting for rate limits...');
    await new Promise(resolve => setTimeout(resolve, 10000)); // 10-second delay
};
