import React, { Component } from 'react'
import { Input, Space, Row, Col, InputNumber, Button } from 'antd';
import QRCode from 'qrcode.react';
import html2pdf from 'html2pdf.js';

const TextArea = Input.TextArea;
/**
 * 默认显示的二维码数据
 */
const defaultUserCodes = [
    {
        name: '测试1',
        account: '0500501'
    },
    {
        name: '测试2',
        account: '0500502'
    },
    {
        name: '测试3',
        account: '0500503'
    },
    {
        name: '测试4',
        account: '0500504'
    },
    {
        name: '测试5',
        account: '0500505'
    },
    {
        name: '测试6',
        account: '0500506'
    },
    {
        name: '测试7',
        account: '0500507'
    },
    {
        name: '测试8',
        account: '0500508'
    },
    {
        name: '测试9',
        account: '0500509'
    },
    {
        name: '测试10',
        account: '0500510'
    },
    {
        name: '测试11',
        account: '0500511'
    },
    {
        name: '测试12',
        account: '0500512'
    },
    {
        name: '测试13',
        account: '0500513'
    },
    {
        name: '测试14',
        account: '0500514'
    },
    {
        name: '测试14',
        account: '0500514'
    },
    {
        name: '测试15',
        account: '0500515'
    },
    {
        name: '测试16',
        account: '0500516'
    },
    {
        name: '测试17',
        account: '0500517'
    },
    {
        name: '测试18',
        account: '0500518'
    },
    {
        name: '测试19',
        account: '0500519'
    },
    {
        name: '测试20',
        account: '0500520'
    },
    {
        name: '测试21',
        account: '0500521'
    },
    {
        name: '测试22',
        account: '0500522'
    },
    {
        name: '测试23',
        account: '0500523'
    },
    {
        name: '测试24',
        account: '0500524'
    },
    {
        name: '测试25',
        account: '0500525'
    },
    {
        name: '测试26',
        account: '0500526'
    },
    {
        name: '测试27',
        account: '0500527'
    },
    {
        name: '测试28',
        account: '0500528'
    },
    {
        name: '测试29',
        account: '0500529'
    },
    {
        name: '测试30',
        account: '0500530'
    },
    {
        name: '测试31',
        account: '0500531'
    },
    {
        name: '测试32',
        account: '0500532'
    },
    {
        name: '测试32',
        account: '0500532'
    },
    {
        name: '测试34',
        account: '0500534'
    },
    {
        name: '测试35',
        account: '0500535'
    },
    {
        name: '测试36',
        account: '0500536'
    },
    {
        name: '测试37',
        account: '0500537'
    },
    {
        name: '测试38',
        account: '0500538'
    },
    {
        name: '测试39',
        account: '0500539'
    },
    {
        name: '测试40',
        account: '0500540'
    },
    {
        name: '测试50',
        account: '0500550'
    },
    {
        name: '测试51',
        account: '0500551'
    },
    {
        name: '测试52',
        account: '0500552'
    },
    {
        name: '测试53',
        account: '0500553'
    },
    {
        name: '测试54',
        account: '0500554'
    },
    {
        name: '测试55',
        account: '0500555'
    },
    {
        name: '测试56',
        account: '0500556'
    },
    {
        name: '测试57',
        account: '0500557'
    },
    {
        name: '测试58',
        account: '0500558'
    },
    {
        name: '测试59',
        account: '0500559'
    },
    {
        name: '测试60',
        account: '0500560'
    },
];

function getTimeStr() {
    var y, m, d, h, mm, s;
    var date = new Date();
    y = date.getFullYear();
    m = date.getMonth() + 1;
    d = date.getDate();
    h = date.getHours();
    mm = date.getMinutes();
    s = date.getSeconds();
    m = m < 10 ? "0" + m : m;
    d = d < 10 ? "0" + d : d;
    h = h < 10 ? "0" + h : h;
    mm = mm < 10 ? "0" + mm : mm;
    s = s < 10 ? "0" + s : s;
    var timeStr = y + m + d + '_' + h + mm + s;
    return timeStr;
}

/**
 * 用户二维码批量生成
 */
export default class UserQrCodePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            /// 文件标题
            titleValue: '用户二维码信息',
            /// 输入的用户信息
            usersInputValue: '',
            userCodes: defaultUserCodes,
            /// 二维码大小
            qrCodeSize: 100,
            showTextArea: true,
        }
    }
    /**
     * 实现方法一（不推荐）：NG
        * 直接在本页面进行刷新
        * 优点：css不用内嵌。
        * 缺点：导致本页面刷新，某些数据丢失。
        * 实现方法：直接获取到需要打印的区域，然后将本页面的innerHTML设置为获取的区域，然后调用系统的print，最后调用reload
     */
    myPrint1 = () => {
        window.document.body.innerHTML = window.document.getElementById('print').innerHTML;
        window.print();
        window.location.reload();
    }
    /**
     * 实现方法二： NG 
    * 打开一个页面进行打印
    * 优点：打印不在关乎本页面的业务
    * 缺点：CSS需要内联
     */
    myPrint2 = () => {
        const win = window.open('', 'printwindow');
        win.document.write(window.document.getElementById('print').innerHTML);
        win.print();
        win.close();
    }
    /**
     * NG
     */
    myPrint = () => {
        const el = document.getElementById('print');
        const iframe = document.createElement('IFRAME');
        let doc = null;
        iframe.setAttribute('style', 'position:absolute;width:0px;height:0px;left:500px;top:500px;');
        document.body.appendChild(iframe);
        doc = iframe.contentWindow.document;
        // 引入打印的专有CSS样式，根据实际修改
        // doc.write('<LINK rel="stylesheet" type="text/css" href="css/print.css">');
        doc.write(el.innerHTML);
        doc.close();
        // 获取iframe的焦点，从iframe开始打印
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
        if (navigator.userAgent.indexOf("MSIE") > 0) {
            document.body.removeChild(iframe);
        }
    }

    exportPdf = (fileName) => {
        // 要导出的dom节点，注意如果使用class控制样式，一定css规则
        const element = document.getElementById('print');
        // 导出配置
        const opt = {
            margin: 0.2,
            filename: fileName,
            image: { type: 'jpeg', quality: 0.98 }, // 导出的图片质量和格式
            html2canvas: { scale: 2, useCORS: true }, // useCORS很重要，解决文档中图片跨域问题
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
            pagebreak: { mode: 'avoid-all', before: '#page2el' },
            // pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        };
        if (element) {
            html2pdf().set(opt).from(element).save(fileName); // 导出
        }
    };


    render() {
        return (
            <Space direction="vertical" style={{ padding: '1rem', width: '100%' }}>
                <Row style={{ width: '100%' }} align="middle">
                    <Col>
                        <div style={{ paddingRight: '10px' }}>保存文件标题:</div>
                    </Col>
                    <Col>
                        <Input placeholder="备注信息" value={this.state.titleValue}
                            addonAfter=".pdf"
                            onChange={(e) => {
                                document.title = e.target.value || "用户二维码";
                                this.setState({ titleValue: document.title })
                            }} />
                    </Col>
                    <Col>
                        <div style={{ marginLeft: '10px' }}>二维码大小:</div>
                    </Col>
                    <Col>
                        <InputNumber min={50} max={250} style={{ margin: '0 16px' }}
                            value={this.state.qrCodeSize}
                            onChange={(value) => {
                                this.setState({
                                    qrCodeSize: value ? value : 100,
                                });
                            }}
                        />
                    </Col>
                    <Col>
                        <Button type="primary" onClick={() => {
                            // this.myPrint();
                            this.setState({
                                showTextArea: !this.state.showTextArea,
                            })
                        }}>显示/隐藏输入框</Button>
                        <Button type="primary" style={{ marginLeft: '5px' }} onClick={() => {
                            this.exportPdf(`${this.state.titleValue}_${this.state.qrCodeSize}px_${getTimeStr()}`);
                        }}>导出PDF</Button>
                    </Col>
                </Row>

                {this.state.showTextArea && <TextArea style={{ height: '300px' }}
                    placeholder="输入想要生成的二维码信息: 姓名@账号，一行写一个，姓名@可以不填写。" value={this.state.usersInputValue}
                    onChange={(e) => {
                        // console.log(e.target.value);
                        this.setState({ usersInputValue: e.target.value });
                    }} onBlur={(e) => {
                        console.log(e.target.value);
                        const usersStr = e.target.value;
                        if (usersStr) {
                            const users = usersStr.split('\n');
                            const userCodes = [];
                            for (const user of users) {
                                console.log('每一行:', user);
                                if (user) {
                                    if (user.indexOf('@') !== -1) {
                                        const userName = user.split('@')[0];
                                        const account = user.split('@')[1].trim();
                                        userCodes.push({
                                            name: userName,
                                            account: account,
                                        });
                                    } else
                                        if (user.indexOf('	') !== -1) {
                                            const userName = user.split('	')[0];
                                            const account = user.split('	')[1].trim();
                                            userCodes.push({
                                                name: userName,
                                                account: account,
                                            });
                                        } else if (user.indexOf(' ') !== -1) {
                                            const userName = user.split(' ')[0];
                                            const account = user.split(' ')[1].trim();
                                            userCodes.push({
                                                name: userName,
                                                account: account,
                                            });
                                        } else {
                                            userCodes.push({
                                                name: '',
                                                account: user,
                                            });
                                        }
                                }

                            }
                            this.setState({
                                userCodes: userCodes,
                            });
                        } else {
                            this.setState({ userCodes: defaultUserCodes });
                        }
                    }} />}
                {/* <Divider orientation="left" plain></Divider> */}
                <Space direction="vertical" style={{ width: '100%' }} id='print'>
                    <div>文件名称:{this.state.titleValue} 大小:{this.state.qrCodeSize}</div>
                    <Row style={{ width: '100%' }} wrap={true} >
                        {
                            this.state.userCodes.map((item, index) => {
                                const qrCode = item.account + '123456';
                                // console.log(item);
                                return <div className='page2el' style={{ marginTop: '2px' }}
                                    key={index + item.name + '@' + item.account}>
                                    <Col flex="0 1 120px" key={index + item.name + '@' + item.account}
                                        className='page2el'
                                        style={{ width: this.state.qrCodeSize + 'px', margin: '5px' }}>
                                        {qrCode && <QRCode value={qrCode} size={this.state.qrCodeSize} style={{ border: '2px solid black' }}></QRCode>}
                                        <div className='page2el' style={{ textAlign: 'center' }}>
                                            {item.name + '  '}
                                            <span style={{ fontSize: '18px', color: 'red' }}>[{item.account}]</span>
                                        </div>
                                    </Col>
                                </div>

                            })
                        }
                    </Row>
                </Space>
            </Space>
        )
    }
}
