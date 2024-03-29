require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const axios = require('axios');
const mongoose = require('./db');
const PurchaseRecord = require('./models/PurchaseRecord');
const getBitcoinPrice = require('./utils/getBitcoinPrice');
const BitcoinPriceRecord = require('./models/BitcoinPriceRecord');
const app = express();
const port = 5050;

const corsOptions = {
  origin: process.env.CORS_ORIGIN, // 只允许来自这个域名的请求
};

app.use(cors(corsOptions)); // 使用cors中间件并应用配置

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use(express.json());

app.post('/purchase', async (req, res) => {
  try {
    const { amountTWD, bitcoinAmount } = req.body;
    const bitcoinPriceAtPurchase = Math.round(amountTWD / bitcoinAmount);

    const record = new PurchaseRecord({
      amountTWD,
      bitcoinAmount,
      bitcoinPriceAtPurchase
    });
    await record.save();
    res.status(201).send(record);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.get('/purchases', async (req, res) => {
    try {
      const records = await PurchaseRecord.find({});
      res.status(200).send(records);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

  app.get('/investment-performance', async (req, res) => {
    try {
      const currentBitcoinPrice = await getBitcoinPrice(); // 獲取當前比特幣價格
      const records = await PurchaseRecord.find({}); // 獲取所有購買記錄
  
      // 計算總投入的台幣金額和獲得的比特幣數量
      let totalInvestedTWD = 0;
      let totalBitcoinPurchased = 0;
      records.forEach(record => {
        totalInvestedTWD += record.amountTWD;
        totalBitcoinPurchased += record.bitcoinAmount;
      });
  
      // 計算當前投資價值和增值或損失
      const currentInvestmentValue = totalBitcoinPurchased * currentBitcoinPrice;
      const profitOrLoss = currentInvestmentValue - totalInvestedTWD;
  
      res.status(200).send({
        totalInvestedTWD,
        currentBitcoinPrice,
        currentInvestmentValue,
        profitOrLoss
      });
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

  async function fetchAndStoreBitcoinPrice() {
    try {
      const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=TWD');
      const priceTWD = response.data.bitcoin.twd;
      const newRecord = new BitcoinPriceRecord({ priceTWD });
      await newRecord.save();
      console.log('Saved new Bitcoin price record:', newRecord);
    } catch (error) {
      console.error('Error fetching or saving Bitcoin price:', error);
    }
  }
  
  // 設定定時任務，每5分鐘執行一次
  cron.schedule('*/5 * * * *', fetchAndStoreBitcoinPrice);

// 獲取比特幣價格歷史記錄的路由
app.get('/bitcoin-prices', async (req, res) => {
    try {
      const priceRecords = await BitcoinPriceRecord.find({}).sort({ timestamp: 1 }); // 按時間戳升序排序
      res.status(200).send(priceRecords);
    } catch (error) {
      res.status(500).send({ message: "Error fetching Bitcoin price records", error: error });
    }
  });
  

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
