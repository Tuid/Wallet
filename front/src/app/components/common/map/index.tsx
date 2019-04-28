import * as React from 'react';
import * as Amap from 'react-amap';
import Axios from 'axios';
export interface ImapProps {
    className: string;
    //  markers: Array<object>;
}

export class Map extends React.Component<ImapProps, any> {
    constructor(prop: ImapProps) {
        super(prop);
        this.state = {
            markers: [],
        };
        this.getMarkers = this.getMarkers.bind(this);
    }

    getIPs() {
        return new Promise((resolve, reject) => {
            Axios.get('http://server.bensyan.top:8080/ip').then(res => {
                if (res.status == 200) {
                    let data = res.data.data;
                    let ips = new Array<string>();
                    data.map((obj: any, idx: any) => {
                        // if (obj.address != '127.0.0.1')
                        ips.push(obj.address);
                    });
                    resolve(ips);
                } else {
                    reject('error');
                }
            });
        });
    }

    getMarkerPositionByip(ip: object) {
        return new Promise((resolve, reject) => {
            Axios.get(
                'http://api.ipstack.com/' +
                    ip +
                    '?access_key=0e4b3fc9bb7012613b5f8b77b422dc20',
            )
                .then(res => {
                    if (res.status == 200) {
                        if (res.data.latitude && res.data.longitude) {
                            let d = {
                                position: {
                                    latitude: res.data.latitude,
                                    longitude: res.data.longitude,
                                },
                                ip: ip,
                            };
                            resolve(d);
                        } else {
                            let d = {
                                position: {
                                    latitude: 0,
                                    longitude: 0,
                                },
                                ip: ip,
                            };
                            resolve(d);
                        }
                    } else {
                        reject('error');
                    }
                })
                .catch(rej => {
                    reject(rej);
                });
        });
    }

    setMarkers(ips: any) {
        let promises = ips.map((ip: any, idx: any) => {
            return this.getMarkerPositionByip(ip);
        });
        Promise.all(promises)
            .then(res => {
                this.setState({
                    markers: res,
                });
            })
            .catch(rej => {
                console.warn(rej);
                this.setState({
                    markers: [],
                });
            });
    }

    getMarkers() {
        this.getIPs()
            .then(res => {
                this.setMarkers(res);
            })
            .catch(rej => {
                console.log(rej);
            });

        //   this.setMarkers(["47.96.67.93", "149.248.60.54"]);
    }

    markersEvents = {
        mouseover: (e: any, marker: any) => {
            let extData = marker.getExtData();
            this.setState({
                infoposition: extData.position,
                infovisible: true,
                ip: extData.ip,
            });
        },
        mouseout: (e: any, marker: any) => {
            this.setState({
                infovisible: false,
            });
        },
    };
    public render() {
        this.getMarkers();
        return (
            <div className={this.props.className}>
                <Amap.Map amapkey={'5f52e2ccb793e9f4b9b79fdc258d78eb'} zoom={2}>
                    <Amap.Markers
                        markers={this.state.markers}
                        useCluster={true}
                        events={this.markersEvents}
                    />
                    <Amap.InfoWindow
                        isCustom={true}
                        position={this.state.infoposition}
                        visible={this.state.infovisible}
                        offset={[0, -20]}
                    >
                        <div className="infowindow">
                            <h1>IP Address</h1>
                            <p>{this.state.ip}</p>
                        </div>
                    </Amap.InfoWindow>
                </Amap.Map>
            </div>
        );
    }
}
