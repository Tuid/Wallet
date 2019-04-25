import * as React from 'react';
import { Map } from 'app/components/common/map';
// TODO move from common
import { OrdersListItem } from 'app/components/common/orders-list-item';
import Axios from 'axios';
// TODO move from common?
import {
    ListHeader,
    IOrderable,
    IPageLimits,
} from 'app/components/common/list-header';
import { IOrder } from 'app/api/types';

export interface IOrdersProps extends IOrderable, IPageLimits {
    className?: string;
    dataSource: Array<IOrder>;
    onClickRow: (orderId: string) => void;
    isListPending: boolean;
    filterPanel: React.ReactElement<any>;
    onRefresh?: () => void;
}

export class OrderListView extends React.PureComponent<IOrdersProps, any> {
    constructor(prop: IOrdersProps) {
        super(prop);
        this.state = {
            markers: [
                {
                    position: {
                        latitude: 36,
                        longitude: 117,
                    },
                },
                {
                    position: {
                        latitude: 38,
                        longitude: 118,
                    },
                },
            ],
        };
        this.getMarkers = this.getMarkers.bind(this);
    }

    async getMarkersPositionByips(ips: Array<string>) {
        let temMarkers: Array<object> = new Array<object>();
        ips.map((ip, idx) => {
            Axios.get(
                'http://api.ipstack.com/' +
                    ip +
                    '?access_key=0e4b3fc9bb7012613b5f8b77b422dc20',
            )
                .then(res => {
                    if (res.status == 200) {
                        let d = {
                            position: {
                                latitude: res.data.latitude,
                                longitude: res.data.longitude,
                            },
                        };
                        temMarkers.push(d);
                    }
                })
                .catch(rej => {
                    console.log(rej);
                });
        });

        return new Promise((reslove, reject) => {
            if (temMarkers.length == 0) {
                reject();
            } else {
                reslove(temMarkers);
            }
        });
    }

    getMarkers() {
        this.getMarkersPositionByips(['47.96.67.93'])
            .then(res => {
                this.setState({
                    markers: [
                        {
                            position: {
                                latitude: 38,
                                longitude: 117,
                            },
                        },
                        {
                            position: {
                                latitude: 33,
                                longitude: 118,
                            },
                        },
                    ],
                });
            })
            .catch(rej => {
                this.setState({
                    markers: null,
                });
            });
    }

    public render() {
        const p = this.props;
        return (
            <div>
                <button onClick={this.getMarkers}>getMarkers</button>
                <Map className="map" markers={this.state.markers} />
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
                        {p.dataSource.map((order, idx) => {
                            return (
                                <OrdersListItem
                                    order={order}
                                    key={order.id}
                                    className="order-list__list-item"
                                    onClick={this.handleClick}
                                />
                            );
                        })}
                    </div>
                    <div className="order-list__filter-panel">
                        {p.filterPanel}
                    </div>
                </div>
            </div>
        );
    }

    public handleClick = (order: IOrder) => {
        this.props.onClickRow(order.id);
    };

    public static readonly headerProps = {
        orderKeys: {
            redshiftGPU: 'Redshift Benchmark',
            ethHashrate: 'GPU Ethash',
            zcashHashrate: 'GPU Equihash',
            price: 'Price',
            duration: 'Duration',
        },
        pageLimits: [10, 25, 50, 100],
    };
}
