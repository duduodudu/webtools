import React, { Component } from 'react'
import { Tabs } from 'antd';
import SystemPage from './SystemPage';
import TrayScan from './TrayScan';
import Home from './Home';
import UserQrCodePage from './UserQrCodePage';
const { TabPane } = Tabs;
export default class AppTab extends Component {
    render() {
        return (
            <div>
                <Tabs defaultActiveKey="4" centered>
                    <TabPane key="1" tab="首页" >
                        <Home />
                    </TabPane>
                    <TabPane key="2" tab="生成分发脚本" >
                        <SystemPage />
                    </TabPane>
                    <TabPane key="3" tab="扫描打托" >
                        <TrayScan />
                    </TabPane>
                    <TabPane key="4" tab="用户二维码" >
                        <UserQrCodePage />
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}
