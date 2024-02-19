const BitcoinPriceRecord = require('../models/BitcoinPriceRecord');

async function getBitcoinPrice() {
  try {
    const latestPriceRecord = await BitcoinPriceRecord.findOne().sort({ timestamp: -1 });
    if (latestPriceRecord) {
      return latestPriceRecord.priceTWD;
    } else {
      throw new Error('No price records found in database.');
    }
  } catch (error) {
    console.error('Error fetching Bitcoin price from database:', error);
    throw error;
  }
}

module.exports = getBitcoinPrice;
