import { OrderGroup } from '../../types/order.interface';

interface SpreadProps {
    bids: OrderGroup[];
    asks: OrderGroup[];
}

export const Spread = ({ bids, asks }: SpreadProps) => {
    const highestBid = bids[0].price;
    const lowestAsk = asks[0].price;

    const spread = lowestAsk - highestBid;
    const spreadPercentage = (spread / highestBid) * 100;
    return (
        <div>
            <div>
                Spread: {spread.toFixed(2)} ({spreadPercentage.toFixed(2)} %)
            </div>
        </div>
    );
};
