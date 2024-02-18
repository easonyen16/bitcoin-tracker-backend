const mongoose = require('mongoose');

const bitcoinPriceRecordSchema = new mongoose.Schema({
  priceTWD: Number, // 比特幣對台幣的價格
  timestamp: { type: Date, default: Date.now } // 記錄的時間戳
});

const BitcoinPriceRecord = mongoose.model('BitcoinPriceRecord', bitcoinPriceRecordSchema);

module.exports = BitcoinPriceRecord;
