import * as React from 'react';
// TODO move from common
import { OrdersListItem } from 'app/components/common/orders-list-item';
// TODO move from common?
import { ListHeader } from 'app/components/common/list-header';
import { IOrder } from 'app/api/types';

export interface IOrdersProps {
    orderBy: string;
    orderDesc: boolean;
    pageLimit: number;
    onChangeLimit: (limit: number) => void;
    onChangeOrder: (orderKey: string, isDesc: boolean) => void;
    onRefresh: () => void;
    className?: string;
    dataSource: Array<IOrder>;
    onClickRow: (orderId: string) => void;
    isListPending: boolean;

    filterPanel: React.ReactElement<any>;
}

export class OrderListView extends React.PureComponent<IOrdersProps, any> {
    public render() {
        const p = this.props;
        return (
            <div className="order-list">
                <ListHeader
                    className="order-list__header"
                    orderBy={p.orderBy}
                    orderKeys={OrderListView.headerProps.orderKeys}
                    orderDesc={p.orderDesc}
                    onRefresh={p.onRefresh}
                    onChangeLimit={p.onChangeLimit}
                    onChangeOrder={p.onChangeOrder}
                    pageLimit={p.pageLimit}
                    pageLimits={OrderListView.headerProps.pageLimits}
                />
                <div className="order-list__list">
                    {p.dataSource.map((order, idx) => (
                        <OrdersListItem
                            order={order}
                            key={order.id}
                            className="order-list__list-item"
                            onClick={this.handleClick}
                        />
                    ))}
                </div>
                <div className="order-list__filter-panel">{p.filterPanel}</div>
            </div>
        );
    }

    public handleClick = (order: IOrder) => {
        this.props.onClickRow(order.id);
    };

    public static readonly headerProps = {
        orderKeys: {
            redshiftGPU: 'Redshift Benchmark',
            ethHashrate: 'ETH hashrate',
            zcashHashrate: 'ZCash hashrate',
            price: 'Price',
            duration: 'Duration',
        },
        pageLimits: [10, 25, 50, 100],
    };
}
