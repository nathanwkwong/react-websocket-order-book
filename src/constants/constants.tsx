export const PAIR_BTC_USD = 'BTC/USD';
export const PAIR_ETH_USD = 'ETH/USD';

export const CONFIG_UNSUBSCRIBE = {
    method: 'unsubscribe',
    params: {
        channel: 'book',
        symbol: [PAIR_ETH_USD]
    }
};

export const CONFIG_KRAKEN_SUBSCRIBE = {
    method: 'subscribe',
    params: {
        channel: 'book',
        symbol: [PAIR_ETH_USD],
        depth: 25
    }
};

export const ORDER_BOOK_LEVELS = 25;
export const GROUPING_SIZE = 0.1; // 0.1 unit price for a group
