import { OrderType } from '../../types/order.interface';
import './styles.css';

interface BarDepthProps {
    depth: number;
    orderType: OrderType;
}

export const BarDepth = ({ depth, orderType }: BarDepthProps) => {
    return (
        <td
            className="container"
            style={{
                width: `${depth}%`,
                backgroundColor: orderType === 'bids' ? 'green' : 'red',
                ...(orderType === 'bids' ? { right: 0 } : { left: 0 })
            }}
        />
    );
};
