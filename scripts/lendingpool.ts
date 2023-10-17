import { ethers, run } from 'hardhat';
// import { GraphQLClient, gql } from 'graphql-request';
// import { v1, v2 } from '@aave/protocol-js';

import { BigNumber }  from '@ethersproject/bignumber';

let exp = BigNumber.from("10").pow(18);
let exp1 = BigNumber.from("10").pow(27);

let wethAddress = '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619'; //weth
let wbtcAddress = '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6'; //weth
let usdcAddress = '0x2791bca1f2de4661ed88a30c99a7a9449aa84174';

let lendingPoolAddressesProviderAddress = '0xd05e3E715d945B59290df0ae8eF85c1BdB684744';



const getAToken = async (_asset) => {
  let lendingPool = await getLendingPool();
  let assetReserveData = await lendingPool['getReserveData'](_asset);
  let assetAToken = await ethers.getContractAt('IAToken', assetReserveData.aTokenAddress);

  return assetAToken;
};

const getDebtToken = async (_asset, _interestRateMode, erc20 = false) => {
  let lendingPool = await getLendingPool();

  let assetReserveData = await lendingPool['getReserveData'](_asset);
  let assetDebtToken;

  if (_interestRateMode === 1) {
    let interface1 = erc20 === true ? 'IERC20' : 'IStableDebtToken';
    assetDebtToken = await ethers.getContractAt(interface1, assetReserveData.stableDebtTokenAddress);
  } else {
    let interface1 = erc20 === true ? 'IERC20' : 'IVariableDebtToken';
    assetDebtToken = await ethers.getContractAt(interface1, assetReserveData.variableDebtTokenAddress);
  }

  return assetDebtToken;
};

const getLendingPool = async () => {
  const lendingPoolAddressesProvider = await ethers.getContractAt('ILendingPoolAddressesProvider', lendingPoolAddressesProviderAddress);
  let lendingPoolAddress = await lendingPoolAddressesProvider['getLendingPool']();
  let lendingPool1 = await ethers.getContractAt('ILendingPool', lendingPoolAddress);

  return lendingPool1;
};


async function main() {

  let maticConfig = {
    lendingPoolAddressesProvider: "0xd05e3E715d945B59290df0ae8eF85c1BdB684744",
   
  }

  const accounts = await ethers.getSigners();

  console.log(
    'Deploying contracts with the account:',
    accounts.map((a) => a.address)
  );

;

let userAddress = "0x1F7b953113f4dFcBF56a1688529CC812865840e1";

let lendingPool =  await getLendingPool();
console.log('lendingPool:', await lendingPool.getAddress());
// user data
let useraccount =  await lendingPool.getUserAccountData(userAddress);


console.log("userdata: ", useraccount); 
console.log("healthFactor: ", useraccount.healthFactor.toString()); 

 //console.log("healthFactor: ", useraccount.healthFactor.mul(BigNumber.from("100")).div(exp).toString()); 
 console.log("totalCollateralETH: ", useraccount.totalCollateralETH.toString()); 
 console.log("currentLiquidationThreshold: ", useraccount.currentLiquidationThreshold.toString()); 
 console.log("ltv: ", useraccount.ltv.toString()); 

//returns the configuration of the user across all the reserves.
let userConfiguration =  await lendingPool.getUserConfiguration(userAddress);
console.log("userConfiguration: ", userConfiguration);

// returns the list of initialized reserves.
let reservesList  = await lendingPool.getReservesList();
console.log(reservesList);

// returns the state and configuration of the reserve
let asset = reservesList[0];
let reserveData =  await lendingPool.getReserveData(asset);
console.log("reserveData: ", reserveData);


let reserveData1 =  await lendingPool.getReserveData(usdcAddress);
// console.log("usdc borrow  variable rate: ", reserveData1.currentVariableBorrowRate.mul(BigNumber.from("10000")).div(exp1).toString());
// //console.log("usdc borrow stable rate: ", reserveData1.currentStableBorrowRate.mul(BigNumber.from("10000")).div(exp1).toString());
// console.log("usdc deposit rate: ", reserveData1.currentLiquidityRate.mul(BigNumber.from("10000")).div(exp1).toString());
// console.log("usdc borrow index: ", reserveData1.variableBorrowIndex.mul(BigNumber.from("10000")).div(exp1).toString());


// let aToken = await getAToken(wethAddress);
// let aTokenbtc = await getAToken(wbtcAddress);
// // console.log("aToken: ", aToken)

//   // variable debt
//   let interestRateMode = 2;

// let debtToken = await getDebtToken(usdcAddress, interestRateMode, true);



  

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });



