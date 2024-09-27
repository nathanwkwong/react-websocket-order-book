import { GROUPING_SIZE, ORDER_BOOK_LEVELS } from './constants/constants';
import { OrderBase, OrderGroup } from './types/order.interface';

export const initOrderGroups = (rawOrder: OrderBase[]): OrderGroup[] => {
    return rawOrder.map((order: OrderBase) => ({
        ...order,
        total: order.qty,
        depth: -1
    }));
};

export const updateOrderBook = (
    currOrderBook: OrderGroup[],
    newOrders: OrderGroup[]
): OrderGroup[] => {
    const newOrderGroupByPrice = groupOrderByPrice(newOrders, GROUPING_SIZE);
    const currOrderGroupByPrice = groupOrderByPrice(
        currOrderBook,
        GROUPING_SIZE
    );

    let mergedOrderGroup = mergeOrderGroup(
        currOrderGroupByPrice,
        newOrderGroupByPrice
    );

    const maxTotalSum = getMaxTotalSum(mergedOrderGroup);

    mergedOrderGroup = addDepths(mergedOrderGroup, maxTotalSum);

    return addTotalSums(mergedOrderGroup);
};

const groupOrderByPrice = (
    orderGroup: OrderGroup[],
    groupSize: number
): OrderGroup[] => {
    const roundedOrderGroup = orderGroup.map((order) => ({
        ...order,
        price: roundToNearestInterval(order.price, groupSize)
    }));

    const newOrderGroups: OrderGroup[] = [];

    roundedOrderGroup.forEach((orderGroup) => {
        const targetOrderGroupIdx = newOrderGroups.findIndex(
            (order) => order.price === orderGroup.price
        );

        if (targetOrderGroupIdx !== -1) {
            // order group exists and add qty to the existing group
            newOrderGroups[targetOrderGroupIdx] = {
                ...newOrderGroups[targetOrderGroupIdx],
                qty: newOrderGroups[targetOrderGroupIdx].qty + orderGroup.qty
            };
        } else {
            // order group does not exist, create a new group
            newOrderGroups.push(orderGroup);
        }
    });
    return newOrderGroups;
};

const mergeOrderGroup = (
    currOrderGroup: OrderGroup[],
    newOrderGroup: OrderGroup[]
) => {
    let mergedOrderGroup = [...currOrderGroup];

    newOrderGroup.forEach((order) => {
        const { price, qty } = order;

        if (qty <= 0) {
            // remove an order group if qty <= 0
            mergedOrderGroup = mergedOrderGroup.filter(
                (orderGroup) => orderGroup.price !== price
            );
        } else {
            if (groupExists(mergedOrderGroup, price)) {
                // update the order group if it exists
                mergedOrderGroup = updateOrderGroup(mergedOrderGroup, order);
            } else {
                // add a new order group if it does not exist
                if (mergedOrderGroup.length < ORDER_BOOK_LEVELS) {
                    mergedOrderGroup = [...mergedOrderGroup, order];
                }
            }
        }
    });
    return mergedOrderGroup;
};

const groupExists = (orderGroup: OrderGroup[], price: number) => {
    return orderGroup.some((order) => order.price === price);
};

const updateOrderGroup = (
    currOrderGroup: OrderGroup[],
    newOrderGroup: OrderBase
): OrderGroup[] => {
    return currOrderGroup.map((orderGroup) => {
        return {
            ...orderGroup,
            qty:
                orderGroup.price === newOrderGroup.price
                    ? orderGroup.qty + newOrderGroup.qty
                    : orderGroup.qty
        };
    });
};

const roundToNearestInterval = (num: number, interval: number): number => {
    return Number((Math.floor(num / interval) * interval).toFixed(2));
};

export const addTotalSums = (orderGroup: OrderGroup[]): OrderGroup[] => {
    let totalSums: number = 0;

    return orderGroup.map((order) => {
        totalSums += order.qty;
        return {
            ...order,
            total: totalSums
        };
    });
};

export const addDepths = (
    orderGroup: OrderGroup[],
    maxTotal: number
): OrderGroup[] => {
    return orderGroup.map((order) => ({
        ...order,
        depth: (order.total / maxTotal) * 100
    }));
};

export const getMaxTotalSum = (orderGroup: OrderGroup[]): number => {
    return orderGroup.reduce((acc, order) => {
        return order.total > acc ? order.total : acc;
    }, 0);
};
