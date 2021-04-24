import React, { Component } from 'react'
import { HashRouter as Router, Link, Route } from 'react-router-dom';
import { Tag } from 'antd';
import SystemPage from './SystemPage';
import TrayScan from './TrayScan';
import Home from './Home';
import UserQrCodePage from './UserQrCodePage';
import './App.less';

export default class App extends Component {

    render() {
        const linkStyle = { marginRight: '1rem', marginLeft: '0.5rem' };
        const menus = [
            {
                title: '首页',
                url: '/',
                component: Home,
            },
            {
                title: '系统分发脚本生成',
                url: '/system',
                component: SystemPage,
            },
            {
                title: '打托扫描看板',
                url: '/scan',
                component: TrayScan,
            },
            {
                title: '用户二维码批量生成',
                url: '/userCodes',
                component: UserQrCodePage,
            }
        ];
        return (
            <div>
                <Router>
                    <div className="App">
                        {menus.map((item) => {
                            return (
                                <Tag color="blue">
                                    <Link to={item.url} style={linkStyle}>{item.title}</Link>
                                </Tag>

                            );
                        })}
                        <hr />
                        {menus.map((item) => {
                            return (
                                <Route path={item.url} exact component={item.component}></Route>
                            );
                        })}
                    </div>
                </Router>
            </div>
        )
    }
}