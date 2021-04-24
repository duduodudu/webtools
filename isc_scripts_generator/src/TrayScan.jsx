import React, { Component } from 'react'
import { Input, Space, Button, Divider, Row, Col, Radio, message } from 'antd';
import QRCode from 'qrcode.react';
const TextArea = Input.TextArea;

export default class TrayScan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputValue: '',
            qrCode: 'HELLO',
            radios: ['原始输出', '看板'],
            radioValue: '原始输出',
            result: '',
        }
    }
    getTrayEntityByScanResult = (scanResult) => {
        const mainCode = scanResult.substr(158, 20);
        const tray = {
            backNo: scanResult.substr(53, 4), //背番 4
            branchNo: scanResult.substr(57, 4), // 枝番 4
            deliveryReceiveCertificateId: scanResult.substr(61, 20).trim(), //纳番20
            dockCode: scanResult.substr(14, 2), // 受入口 2
            mainConveyanceNo: mainCode.replace(/\s*/g, ""), //工程代码 1
            orderDate: scanResult.substr(219, 8),//订单号前8位
            orderNo: scanResult.substr(219, 12).trim(), //订单号12
            partNo: scanResult.substr(16, 12), // 品番12
            placeSort: '', //堆叠顺序
            planeNo: scanResult.substr(231, 2),  // 链号2
            projectNo: mainCode.replace(/\s*/g, ""),  // 工程代码 1
            supplierNo: scanResult.substr(1, 4), // 供应商代码 4
            supplierWorkArea: scanResult.substr(5, 1), //供应商工区 1
            trayNo: ''  // 托号
        }
        return tray;
    }
    /**
     * 解析成为看板
     */
    handleAnalise = () => {
        const scanResult = this.state.qrCode;
        if (!scanResult) {
            return;
        }
        const type = this.state.radioValue;
        let result = '';
        switch (type) {
            case '原始输出':
                result = scanResult;
                break;
            case '看板':
                result = JSON.stringify(this.getTrayEntityByScanResult(scanResult), null, 2);
                break;
            default:
                result = '暂无解析方法';
                break;
        }
        this.setState({ result });
    }
    render() {
        return (
            <Space direction="vertical" style={{ padding: '1rem', width: '100%' }}>
                <div>输入想要生成的二维码</div>
                <TextArea showCount={true}
                    placeholder="输入想要生成的二维码信息" value={this.state.inputValue}
                    onChange={(e) => {
                        this.setState({ inputValue: e.target.value });
                    }} />
                <Space direction="horizontal" style={{ width: '100%' }}>
                    <Button type="primary" onClick={() => {
                        this.setState({ inputValue:'' });
                    }}>清空输入</Button>
                    <Button type="primary" onClick={() => {
                        if (!this.state.inputValue) {
                            message.error('输入内容为空');
                            return;
                        }
                        this.setState({
                            qrCode: this.state.inputValue,
                        }, () => {
                            this.handleAnalise();
                        });
                    }}>生成</Button>
                </Space>
                <Divider orientation="left" plain></Divider>
                <Space direction="vertical" style={{ width: '100%' }}>
                    <Row style={{ width: '100%' }} wrap={false}>
                        <Col flex="300px">
                            {this.state.qrCode && <QRCode value={this.state.qrCode} size={250}></QRCode>}
                        </Col>
                        <Col flex="auto">
                            <div>数据内容:
                                {
                                    this.state.qrCode.split('').map((item, index) => {
                                        console.log('分割字符串', index, item);
                                        return (<span
                                            key={index}
                                            style={{ background: 'lightgrey' }}>
                                            {item === ' ' ? <strong style={{ color: 'yellow' }}>&copy;</strong> : item}
                                        </span>);
                                    })}
                            </div>
                            <div>
                                数据长度:{this.state.qrCode.length}
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <strong>&copy;</strong>:表示空格</div>
                            <div>
                                解析类型:&nbsp;&nbsp;&nbsp;&nbsp;
                                <Radio.Group onChange={(e) => {
                                    this.setState({ radioValue: e.target.value }, () => {
                                        this.handleAnalise();
                                    });
                                }} value={this.state.radioValue}>
                                    {this.state.radios.map((item) => {
                                        return <Radio value={item} key={item}>{item}</Radio>;
                                    })}
                                </Radio.Group>
                            </div>
                            <div>解析结果:</div>
                            <div>{this.state.result}</div>
                        </Col>
                    </Row>
                </Space>
            </Space>
        )
    }
}
