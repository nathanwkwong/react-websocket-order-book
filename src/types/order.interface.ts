export type OrderType = 'bids' | 'asks';

export interface OrderRaw {
    symbol: string;
    bids: OrderBase[];
    asks: OrderBase[];
}

export interface OrderBase {
    price: number;
    qty: number;
}

export interface OrderGroup extends OrderBase {
    total: number;
    depth: number;
}
