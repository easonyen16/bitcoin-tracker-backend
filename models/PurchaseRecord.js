const mongoose = require('mongoose');

// 定義購買記錄模型的結構
const purchaseRecordSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  amountTWD: Number, // 台幣金額
  bitcoinAmount: Number, // 購買的比特幣數量
  bitcoinPriceAtPurchase: Number, // 購買時的比特幣價格
});

// 創建模型
const PurchaseRecord = mongoose.model('PurchaseRecord', purchaseRecordSchema);

module.exports = PurchaseRecord;
