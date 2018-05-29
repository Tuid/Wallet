import * as React from 'react';
import * as cn from 'classnames';
import { IAccountBrief, IBenchmarkMap } from 'app/api/types';
import { Benchmark } from 'app/components/common/benchmark';
import { PropertyList } from 'app/components/common/property-list';
import * as moment from 'moment';
import { ProfileBrief } from 'app/components/common/profile-brief';
import { Button } from 'app/components/common/button';
import { Balance } from 'app/components/common/balance-view';
import { moveDecimalPoint } from 'app/utils/move-decimal-point';

interface IProps {
    className?: string;
    supplier: IAccountBrief;
    consumer: IAccountBrief;
    duration: number;
    price: string;
    totalPayout: string;
    benchmarkMap: IBenchmarkMap;
    marketAccountAddress: string;
    showButtons: boolean;
    propertyList: {
        id: string;
        startTime: number;
        endTime: number;
        timeLeft: number;
        blockedBalance: string;
        status: number;
        supplierAddress: string;
    };
}

export class DealView extends React.PureComponent<IProps, never> {
    private config = [
        {
            name: 'Deal ID',
            key: 'id',
        },
        {
            name: 'Deal status',
            key: 'status',
            render: (value: string) => (value ? 'Active' : 'Close'),
        },
        {
            name: 'Start',
            key: 'startTime',
            render: (value: string) =>
                moment.unix(parseInt(value, 10)).format('D MMM YYYY | H:mm'),
        },
        {
            name: 'Finish',
            key: 'endTime',
            render: (value: any) =>
                value
                    ? moment
                          .unix(parseInt(value, 10))
                          .format('D MMM YYYY | H:mm')
                    : '---',
        },
        {
            name: 'Type',
            key: 'supplierAddress',
            render: (value: any) =>
                this.props.marketAccountAddress.toLowerCase() === value
                    ? 'SELL'
                    : 'BUY',
        },
        {
            name: 'Executed payment',
            key: 'blockedBalance',
            render: (value: any) => `${moveDecimalPoint(value, 18, 2)} SNM`,
        },
        {
            name: 'Time left',
            key: 'timeLeft',
            render: (value: any) => `${value} hours`,
        },
    ];

    public handleFinishDeal = () => {
        //this.props.onFinishDeal();
    };

    public render() {
        const p = this.props;

        return (
            <div className={cn('sonm-deal', p.className)}>
                <div className="sonm-deal__column-left">
                    <div className="sonm-deal__column-left__consumer">
                        <div className="sonm-deal__header">Consumer</div>
                        <ProfileBrief
                            profile={p.consumer}
                            showBalances={false}
                        />
                    </div>
                    <div className="sonm-deal__colum-left__supplier">
                        <div className="sonm-deal__header">Supplier</div>
                        <ProfileBrief
                            profile={p.supplier}
                            showBalances={false}
                        />
                    </div>
                    <div className="sonm-deal__column-left__details">
                        <div className="sonm-deal__header">Details</div>
                        <PropertyList
                            dataSource={p.propertyList}
                            config={this.config}
                        />
                    </div>
                </div>
                <div className="sonm-deal__column-right">
                    {p.showButtons ? (
                        <div className="sonm-deal__column-right__buttons">
                            <Button
                                type="submit"
                                color="violet"
                                onClick={this.handleFinishDeal}
                            >
                                Finish Deal
                            </Button>
                        </div>
                    ) : null}
                    <div className="sonm-deal__column-right__benchmarks">
                        <div className="sonm-deal__header">
                            Resource parameters
                        </div>
                        <Benchmark data={p.benchmarkMap} keys={[]} />
                    </div>
                    <div className="sonm-deal__column-right__price-duration">
                        <div className="sonm-deal__header">
                            Price and duration
                        </div>
                        <Balance
                            className="sonm-deal__column-right__price-duration--price"
                            balance={p.price}
                            decimalPointOffset={18}
                            decimalDigitAmount={2}
                            symbol="USD/h"
                        />
                        <div className="sonm-deal__column-right__price-duration--duration">
                            {p.duration} hour(s)
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default DealView;