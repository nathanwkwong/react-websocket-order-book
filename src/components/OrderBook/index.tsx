import { useState, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import {
    CONFIG_KRAKEN_SUBSCRIBE,
    CONFIG_UNSUBSCRIBE,
    PAIR_ETH_USD
} from '../../constants/constants';
import { OrderGroup, OrderRaw } from '../../types/order.interface';
import { initOrderGroups, updateOrderBook } from '../../utils';
import { TablePriceLevel } from '../TablePriceLevel';
import { Spread } from '../Spread';
import './styles.css';

const KRAKEN_MARKET_DATA_URL = 'wss://ws.kraken.com/v2';

export const OrderBook = () => {
    const [bids, setBids] = useState<OrderGroup[]>([]);
    const [asks, setAsks] = useState<OrderGroup[]>([]);
    const [isSubscribing, setIsSubscribing] = useState(false);

    const { sendMessage, lastMessage, readyState, getWebSocket } = useWebSocket(
        KRAKEN_MARKET_DATA_URL,
        {
            shouldReconnect: () => true
        }
    );

    useEffect(() => {
        const updateOrderBookWithNewOrder = (rawOrderData: OrderRaw) => {
            if (rawOrderData.bids) {
                const rawOrderGroup: OrderGroup[] = initOrderGroups(
                    rawOrderData.bids
                );
                let newBids = updateOrderBook(bids, rawOrderGroup);
                setBids(newBids);
            }

            if (rawOrderData.asks) {
                const rawOrderGroup: OrderGroup[] = initOrderGroups(
                    rawOrderData.asks
                );
                let newAsks = updateOrderBook(asks, rawOrderGroup);
                setAsks(newAsks);
            }
        };

        if (lastMessage !== null && lastMessage.data) {
            const dataDecode = JSON.parse(lastMessage.data);
            if (
                dataDecode.channel === 'book' &&
                dataDecode.data &&
                (dataDecode.type === 'update' || dataDecode.type === 'snapshot')
            ) {
                updateOrderBookWithNewOrder(dataDecode.data[0]);
            }
        }
    }, [lastMessage]);

    const handleClickSendMessage = () => {
        setIsSubscribing(true);
        sendMessage(JSON.stringify(CONFIG_UNSUBSCRIBE));
        sendMessage(JSON.stringify(CONFIG_KRAKEN_SUBSCRIBE));
    };

    const handleUnsubscribe = () => {
        getWebSocket()?.close();
        setIsSubscribing(false);
    };

    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Open',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated'
    }[readyState];

    return (
        <div>
            <div className="nav-bar">
                <div>Pair: {PAIR_ETH_USD}</div>
                <div>WebSocket: {connectionStatus}</div>

                {isSubscribing ? (
                    <button onClick={handleUnsubscribe}>Unsubscribe</button>
                ) : (
                    <button
                        onClick={handleClickSendMessage}
                        disabled={readyState !== ReadyState.OPEN}>
                        Subscribe
                    </button>
                )}
            </div>
            {bids.length && asks.length ? (
                <div className="order-book-container">
                    <Spread bids={bids} asks={asks} />
                    <div className="order-book">
                        <TablePriceLevel orderGroups={bids} orderType="bids" />
                        <TablePriceLevel orderGroups={asks} orderType="asks" />
                    </div>
                </div>
            ) : null}
        </div>
    );
};
