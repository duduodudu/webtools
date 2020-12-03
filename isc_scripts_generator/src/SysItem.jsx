import './SysItem.less';
import React, {Component} from 'react';
import {Button, Col, Input, Row, Select, Form} from "antd";
import {CloseCircleOutlined} from "@ant-design/icons";

const {Option} = Select;

class SysItem extends Component {
    sysInputStyle = {width: '80%'};
    inputStyle = {width: '100%'};
    formRef = React.createRef();

    constructor(props) {
        super(props);
        this.state = {

            system: props.system,
        }
    }

    onSysNameChange = (e) => {
        console.log(this.formRef.current);
        this.formRef.current.validateFields().then((names) => {
            console.log('检验结果', names);
        });
        this.props.onSysNameChange(e.target.value);
    }
    onAddCondition = () => {
        this.props.onAddCondition();
    }
    /**
     * 判断条件发生变化（input）
     */
    onConditionChangedInput = (e, conIndex, condition) => {
        console.log('输入的条件内容（onBlur）:', e.target.value);
        const change = JSON.parse(JSON.stringify(condition));
        change[e.target.name] = e.target.value;
        this.props.onChangeCondition(conIndex, change);
        this.formRef.current.validateFields();
    }
    /**
     * 判断条件发生变化（select）
     */
    onConditionChangedSelect = (e, type, conIndex, condition) => {
        const change = JSON.parse(JSON.stringify(condition));
        change[type] = e;
        this.props.onChangeCondition(conIndex, change);
        this.formRef.current.validateFields();
    }

    onConditionChangedInputToUpdateView = (e, conIndex) => {
        const system = this.state.system;
        const condition = system.conditions[conIndex];
        condition[e.target.name] = e.target.value;
        console.log('输入的条件内容:', e.target.name, e.target.value);
        this.setState({
            system,
        })
    }

    render() {
        return (
            <div>
                <Form ref={this.formRef} layout={{
                    labelCol: {width: '0'},
                    wrapperCol: {width: '100%'},
                }}>
                    <Row justify="end">
                        <Col span={10}>
                            {
                                this.props.index === 0 ?
                                    <div style={{width: '100px', display: 'inline-block'}}></div>
                                    :
                                     <Form.Item style={{display: 'inline-flex'}}
                                        name={'connectStr' + this.props.system.id}
                                                           rules={[{required: true, message: '请选择'}]}>
                                    <Select value={this.props.system.connectStr}
                                        style={{width: "100px"}}
                                        onChange={(e) => {
                                            this.props.onSysConnectChange(e);
                                        }}>
                                        <Option value="if">if</Option>
                                        <Option value="else if">else if</Option>
                                        <Option value="else">else</Option>
                                    </Select>
                                </Form.Item>
                            }

                            <Form.Item style={{display: 'inline-flex'}}
                                       name={'sysName' + this.props.system.id}
                                       rules={[{required: true, message: '请输入系统名称'}]}>
                                <Input style={this.sysInputStyle}
                                       name="sysName"
                                       value={this.state.system.sysName}
                                       onBlur={this.onSysNameChange}
                                       onChange={(e) => {
                                           const system = this.state.system;
                                           system.sysName = e.target.value;
                                           this.setState({system});
                                       }}
                                       placeholder="SYS2012"/>
                            </Form.Item>
                            {
                                this.props.index === 0 ?
                                    <div></div>
                                    :
                                    <Button danger type="text" shape="circle"
                                            onClick={() => {
                                                this.props.onRemoveSystem(this.props.index);
                                            }}
                                            icon={<CloseCircleOutlined/>}/>
                            }
                        </Col>
                        <Col span={14}>
                            {
                                this.state.system.conditions.map((condition, conIndex) => {
                                    return <Input.Group compact key={condition.id}>
                                        {
                                            conIndex === 0 ?
                                                <div style={{width: '80px', display: 'inline-block', marginTop: '4px'}}>
                                                    <Button ghost type="primary" size="small"
                                                            onClick={this.onAddCondition}
                                                        // icon={<PlusCircleOutlined />}
                                                    >添加条件</Button>
                                                </div>
                                                :
                                                <Form.Item style={{display: 'inline-flex'}}
                                                           name={'connectStr' + this.props.system.conditions[conIndex].id}
                                                           rules={[{required: true, message: '请选择'}]}>
                                                    <Select vaule={condition.connectStr}
                                                            style={{width: '80px'}}
                                                            onChange={(e) => {
                                                                this.onConditionChangedSelect(e, 'connectStr', conIndex, condition);
                                                            }}>
                                                        <Option value="&&"> {'&&'}</Option>
                                                        <Option value="||"> {'||'}</Option>
                                                    </Select>
                                                </Form.Item>
                                        }
                                        <Form.Item style={{display: 'inline-flex'}}
                                                   name={'keyStr' + this.props.system.conditions[conIndex].id}
                                                   rules={[{required: true, message: '请输入判断的属性名称'}]}>
                                            <Input style={this.inputStyle}
                                                   name="keyStr" value={condition.keyStr}
                                                   onChange={(e) => {
                                                       this.onConditionChangedInputToUpdateView(e, conIndex)
                                                   }}
                                                   onBlur={(e) => {
                                                       this.onConditionChangedInput(e, conIndex, condition)
                                                   }}
                                                   placeholder="key"/>
                                        </Form.Item>
                                        <Form.Item style={{display: 'inline-flex'}}
                                                   name={'relationStr' + this.props.system.conditions[conIndex].id}
                                                   rules={[{required: true, message: '请选择'}]}>
                                            <Select value={condition.relationStr}
                                                    style={{width: '80px'}}
                                                    onChange={(e) => {
                                                        this.onConditionChangedSelect(e, 'relationStr', conIndex, condition);
                                                    }}>
                                                <Option value="<"> {'<'}</Option>
                                                <Option value="<="> {'<='}</Option>
                                                <Option value="=="> {'=='}</Option>
                                                <Option value=">="> {'>+'}</Option>
                                                <Option value=">"> {'>'}</Option>
                                                <Option value="!="> {'='}</Option>
                                            </Select>
                                        </Form.Item>
                                        <Form.Item style={{display: 'inline-flex'}}
                                                   name={'vauleStr' + this.props.system.conditions[conIndex].id}
                                                   rules={[{required: true, message: '请输入判断的属性值'}]}>
                                            <Input style={this.inputStyle}
                                                   name="vauleStr" value={condition.vauleStr}
                                                   onChange={(e) => {
                                                       this.onConditionChangedInputToUpdateView(e, conIndex)
                                                   }}
                                                   onBlur={(e) => {
                                                       this.onConditionChangedInput(e, conIndex, condition)
                                                   }}
                                                   placeholder="value"/>
                                        </Form.Item>
                                        {
                                            conIndex === 0 ?
                                                <div></div>
                                                :
                                                <Button ghost type="danger" shape="circle"
                                                        onClick={() => {
                                                            this.props.onRemoveCondition(conIndex);
                                                        }}
                                                        icon={<CloseCircleOutlined/>}/>
                                        }
                                    </Input.Group>
                                })
                            }
                            {/* <Button type="primary"
                            onClick={this.onAddCondition}
                            icon={<PlusCircleOutlined />} >添加判断条件</Button> */}
                        </Col>
                    </Row>
                </Form>
            </div>
        );
    }
}


export default SysItem;
