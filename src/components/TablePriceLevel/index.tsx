import { OrderGroup, OrderType } from '../../types/order.interface';
import { addDepths, getMaxTotalSum } from '../../utils';
import { BarDepth } from '../BarDepth';
import './styles.css';

interface TablePriceLevelProps {
    orderGroups: OrderGroup[];
    orderType: OrderType;
}

export const TablePriceLevel = ({
    orderGroups,
    orderType
}: TablePriceLevelProps) => {
    // sort by price
    let sortedOrderGroups = orderGroups.sort((a, b) => {
        if (orderType === 'bids') {
            return b.price - a.price;
        } else {
            return a.price - b.price;
        }
    });

    const maxTotalSum = getMaxTotalSum(sortedOrderGroups);

    sortedOrderGroups = addDepths(sortedOrderGroups, maxTotalSum);

    return (
        <table>
            <thead>
                {orderType === 'bids' ? (
                    <tr>
                        <td>Total</td>
                        <td>Amount</td>
                        <td>Price</td>
                    </tr>
                ) : (
                    <tr>
                        <td>Price</td>
                        <td>Amount</td>
                        <td>Total</td>
                    </tr>
                )}
            </thead>
            <tbody>
                {sortedOrderGroups.map(({ price, qty, total, depth }) =>
                    orderType === 'bids' ? (
                        <tr className="table-row" key={price}>
                            <td>{total.toFixed(4)}</td>
                            <td>{qty.toFixed(4)}</td>
                            <td>{price.toFixed(2)}</td>
                            <BarDepth depth={depth} orderType={orderType} />
                        </tr>
                    ) : (
                        <tr className="table-row">
                            <td>{price.toFixed(2)}</td>
                            <td>{qty.toFixed(4)}</td>
                            <td>{total.toFixed(4)}</td>
                            <BarDepth depth={depth} orderType={orderType} />
                        </tr>
                    )
                )}
            </tbody>
        </table>
    );
};
