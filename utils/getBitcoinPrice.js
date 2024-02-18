const axios = require('axios');

async function getBitcoinPrice() {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=TWD');
    const price = response.data.bitcoin.twd; // 獲取以台幣(TWD)表示的比特幣價格
    return price;
  } catch (error) {
    console.error('Error fetching Bitcoin price:', error);
    throw error;
  }
}

module.exports = getBitcoinPrice;
