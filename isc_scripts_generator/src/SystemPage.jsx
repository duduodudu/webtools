import "./SystemPage.less";
import { Button, Col, Input, Row, Space, Upload, message, notification,Modal } from "antd";
import React, { Component } from "react";
import {QuestionCircleOutlined} from '@ant-design/icons'
// JSON预览插件
import ReactJson from "react-json-view";
// 代码编辑器
import 'codemirror/lib/codemirror.js';
import 'codemirror/lib/codemirror.css';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/hint/javascript-hint';
import 'codemirror/theme/ambiance.css';

import 'codemirror/addon/fold/foldgutter.css';
import 'codemirror/addon/fold/brace-fold.js';
import 'codemirror/addon/fold/comment-fold.js';
import 'codemirror/addon/fold/foldcode.js';
import 'codemirror/addon/fold/foldgutter.js';
import 'codemirror/addon/fold/indent-fold.js';


import SysItem from "./SysItem";
import { virtualData } from "./data";
// import { formatJson } from "./format";
import  get_beautify  from "js-beautify";
import { parser } from "jsonlint-mod";

const methodName = 'dispatching';
const defaultFunction = `function ${methodName}(data){
    var result = {};
    var originData = JSON.parse(data);
    var sys1 = JSON.parse(data);
    sys1.messages=[];
    var messages = originData.messages;
    if(messages){
        var sys1Messages = [];
        for(var i = 0 ; i < messages.length; i ++ ) {
            var msg = messages[i];
            if(msg.type=="1"){
                sys1Messages.push(msg);
            }
        }
        sys1.messages = sys1Messages;
    }
    
    result.sys1 = sys1;
    console.log("输入的函数执行了");
    return result;
}`;
let functionStartTime = new Date();
let systemId = 1;
let conditionId = 1;

class SystemPage extends Component {
    scriptEditorRef = React.createRef();
    inputJsonEditorRef = React.createRef();
    constructor(props) {
        super(props);
        this.state = {
            prevError: '',
            // 参数是否为预览状态
            isInputJsonPreview: false ,
            // 参数输入
            inputJson: JSON.stringify(virtualData, null, 4),
            // 脚本函数编辑
            functionStr: defaultFunction,
            // 耗时时间
            duration: 0,
            outputJson: {},
            // 解析的数组名称
            arrayName: 'logisticsPlanning',
            //
            systems: [
                {
                    id: 1,
                    sysName: 'SYS1',
                    connectStr: 'if',// else if
                    conditions: [
                        {
                            id: 1,
                            keyStr: 'systemType',
                            relationStr: '==',
                            vauleStr: '1',
                            connectStr: '',
                        }
                    ],
                }
            ],
        }

        this.showTips();
    }
    /**
     * 显示操作说明
     */
    showTips = ()=> {
        Modal.info({
            title: '使用帮助',
            content: (
              <div>
                <p>1. 填写想要解析的数组。</p>
                <p>
                    2. 添加对应的分发系统，编写对应的过滤条件;
                <span style={{color:'red'}}>系统名称和条件必填，不然会报错的哦</span>
                </p>
                <p>3. 点击"生成脚本",并对脚本进行简单检查;</p>
                <p>4. 输入或者导入参数，点击"运行"进行校验;</p>
              </div>
            ),
            onOk() {},
          });
    }
    /**
    * 添加系统
    */
    addSystem = () => {
        systemId += 1;
        const system = {
            sysName: '',
            id: systemId,
            connectStr: 'if',// else if
            conditions: [
                {
                    id: 1,
                    keyStr: '',
                    relationStr: '',
                    vauleStr: '',
                    connectStr: '',
                }
            ],
        };
        const systems = this.state.systems;
        systems.push(system);
        this.setState({
            systems: systems,
        })
    }
    /**
     * 重置系统
     */
    resetSystem = () => {
        systemId += 1;
        const system = {
            sysName: '',
            id: systemId,
            connectStr: 'if',
            conditions: [
                {
                    id: 1,
                    keyStr: '',
                    relationStr: '',
                    vauleStr: '',
                    connectStr: '',
                }
            ],
        };
        this.setState({
            systems: [system],
        })
    }

    render() {
        return (
            <div className="main">
                {/* <Divider orientation="left">分发平台脚本工具</Divider> */}
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col className="main-item" span={24}>
                        <div>
                            <Space>
                                <label>解析数组:</label>
                                <Input name="arrayName" value={this.state.arrayName} onChange={this.inputChange} placeholder="list" />
                                <Button type="primary" onClick={this.addSystem}>添加系统</Button>
                                <Button type="primary" onClick={this.resetSystem}>重置系统</Button>
                                <Button type="primary" onClick={this.generateScript}>生成脚本</Button>
                                <Button type="primary" onClick={() => {
                                    this.generateScript();
                                    this.runScript();
                                }}>生成+运行</Button>
                                <Button type="primary"
                                    onClick={this.showTips}
                                    icon={<QuestionCircleOutlined />} >使用帮助</Button>
                            </Space>
                        </div>
                        <Row className="text-center">
                            <Col span={8}>系统名称</Col>
                            <Col span={16}>分发条件</Col>
                        </Row>
                        {
                            this.state.systems.map((system, index) => {
                                return <SysItem index={index} system={system} key={system.id}
                                    onSysNameChange={(name) => {
                                        const systems = this.state.systems;
                                        systems[index].sysName = name;
                                        this.setState({
                                            systems: systems,
                                        });
                                    }}
                                    onSysConnectChange={(str) => {
                                        const systems = this.state.systems;
                                        systems[index].connectStr = str;
                                        this.setState({
                                            systems: systems,
                                        }, () => {
                                            console.log(systems);
                                        });
                                    }}
                                    onRemoveSystem={(index) => {
                                        const systems = this.state.systems;
                                        systems.splice(index, 1);
                                        this.setState({
                                            systems: systems,
                                        });
                                    }}
                                    onRemoveCondition={(conIndex) => {
                                        const systems = this.state.systems;
                                        systems[index].conditions.splice(conIndex, 1);
                                        this.setState({
                                            systems: systems,
                                        });
                                    }}
                                    onChangeCondition={(conIndex, changed) => {
                                        const systems = this.state.systems;
                                        systems[index].conditions.splice(conIndex, 1, changed);
                                        this.setState({
                                            systems: systems,
                                        }, () => {
                                            console.log(this.state.systems);
                                        });

                                    }}
                                    onAddCondition={() => {
                                        conditionId += 1;
                                        const condition = {
                                            id: conditionId,
                                            keyStr: '',
                                            relationStr: '==',
                                            vauleStr: '',
                                            connectStr: '&&',
                                        };
                                        const systems = this.state.systems;
                                        systems[index].conditions.push(condition);
                                        this.setState({
                                            systems: systems,
                                        });
                                    }}/>;
                            })
                        }
                    </Col>
                </Row>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col className="main-item" span={24}>
                        <Space>
                            <label>脚本在线编辑</label>
                            <Upload showUploadList={false} onChange={(info) => {
                                this.handleUploadAntd(info, 'functionStr');
                            }}>
                                <Button type="primary">导入</Button>
                            </Upload>
                            <Button type="primary" onClick={this.runScript}>运行</Button>
                            <Button type="primary" onClick={() => {
                                this.downloadTxtFile(this.state.functionStr);
                            }}>导出</Button>
                            <Button type="primary" onClick={() => {
                                this.copyToClip(this.state.functionStr);
                            }}>复制</Button>
                            <Button type="primary" onClick={() => {
                                const source = this.getFormatScript(this.state.functionStr);
                                 this.scriptEditorRef.current.editor.setValue(source);
                                 this.setState({functionStr:source});
                            }}>格式化</Button>

                            <input type="file"
                                onChange={(e) => {
                                    this.handleUpload(e, 'functionStr');
                                }} />
                        </Space>
                        <CodeMirror
                            value={defaultFunction}
                            ref={this.scriptEditorRef}
                            options={{
                                mode: {
                                    name: 'javascript',
                                },
                                mime: 'text/javascript, application/json, application/ld+json, text/typescript, application/typescript',
                                // theme: 'idea',
                                lineNumbers: true,
                                matchBrackets: true, // 匹配结束符号，比如"]、}"
                                autoCloseBrackets: true, // 自动闭合符号
                                styleActiveLine: true, // 显示选中行的样式
                                smartIndent: true, // 智能缩进
                                indentUnit: 4, // 智能缩进单位为4个空格长度
                            }}
                            onKeyPress={(e) => {
                                // 调用提示
                                e.showHint();
                            }}
                            onBlur={(editor) => {
                                const value = editor.getValue();
                                // console.log('输入的函数为:', value);
                                this.setState({
                                    functionStr: value,
                                });
                            }}
                            onCursorActivity={e => {
                                // 调用提示
                                //e.showHint();
                            }}
                            onChange={(editor, data, value) => {
                                // editor.showHint();
                            }}
                        />
                    </Col>
                </Row>
                {/* <Divider orientation="left"></Divider> */}
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col className="main-item" span={12}>
                        <Space>
                            <label>输入参数:</label>
                            <Upload showUploadList={false} onChange={(info) => {
                                this.handleUploadAntd(info, 'inputJson');
                            }}>
                                <Button type="primary">导入</Button>
                            </Upload>
                            <Button type="primary" onClick={() => {
                                this.setState({
                                    inputJson: '{}',
                                })
                            }}>清除</Button>
                            <Button type="primary" onClick={() => {
                                const isInputJsonPreview = this.state.isInputJsonPreview;
                                if(isInputJsonPreview){
                                    this.setState({ isInputJsonPreview :!isInputJsonPreview});
                                } else {
                                    if(this.parseScript()){
                                        this.setState({ isInputJsonPreview :!isInputJsonPreview});
                                    }
                                }

                            }}>{this.state.isInputJsonPreview ?'编辑':'预览'}</Button>
                            <Button type="primary" onClick={this.runScript}>运行</Button>
                            <Button type="primary" onClick={()=>{
                                this.parseScript();
                            }}>校验</Button>
                            <input type="file"
                                onChange={(e) => {
                                    this.handleUpload(e, 'inputJson');
                                }} />
                        </Space>
                        {this.state.isInputJsonPreview
                            ? <ReactJson src={JSON.parse(this.state.inputJson)} />
                            : <CodeMirror
                            value={this.state.inputJson}
                            ref={this.inputJsonEditorRef}
                            options={{
                                mode: {
                                    name: 'javascript',
                                },
                                mime: 'text/javascript, application/json, application/ld+json, text/typescript, application/typescript',
                                lineNumbers: true,
                                matchBrackets: true, // 匹配结束符号，比如"]、}"
                                autoCloseBrackets: true, // 自动闭合符号
                                styleActiveLine: true, // 显示选中行的样式
                                smartIndent: true, // 智能缩进
                                indentUnit: 2, // 智能缩进单位为4个空格长度
                                foldGutter: true,
                                lineWrapping: true,
                            }}
                            onBlur={(editor) => {
                                let value = editor.getValue();
                                // value = JSON.stringify(JSON.parse(value), null, 2);
                                // value = formatJson(value);
                                // editor.setValue(value);
                                this.setState({
                                    inputJson: value,
                                });
                                // this.runScript();
                            }}
                            onCursorActivity={e => {
                                // 调用提示
                                //e.showHint();
                            }}
                            onChange={(editor, data, value) => {
                                // editor.showHint();
                            }}
                        />}
                        {/* <textarea name="inputJson" value={this.state.inputJson}
                                  onChange={this.inputChange}
                                  onBlur={this.inputBlur}
                        ></textarea> */}
                    </Col>
                    <Col className="main-item" span={12}>
                        <div>
                            <label>输出参数:</label>
                            <label>耗时:约<span>{this.state.duration}</span>ms</label>
                        </div>
                        <ReactJson src={this.state.outputJson} />
                    </Col>
                </Row>
            </div>
        );
    }

    handleUpload = (e, type) => {
        //console.log(e.target.files[0]);
        const reader = new FileReader();
        reader.readAsText(e.target.files[0]);
        reader.onload = (e) => {
            const txt = e.target.result;
            if (type === 'functionStr') {
                console.log(this.scriptEditorRef);
                const editor = this.scriptEditorRef.current.editor;
                editor.setValue(txt);
            } else if (type === 'inputJson') {
                const editor = this.inputJsonEditorRef.current.editor;
                editor.setValue(txt);
            }
            this.setState({
                [type]: e.target.result,
            })
        };
    }
    handleUploadAntd = (info, type) => {
        if (info.file.status === 'uploading') {
            // console.log(info.file, info.fileList);
            return;
        }
        if (info.file.status === 'error') {
            message.success(`${info.file.name} 导入成功！`);
            const reader = new FileReader();
            reader.readAsText(info.file.originFileObj);
            reader.onload = (e) => {
                const txt = e.target.result;
                if (type === 'functionStr') {
                    console.log(this.scriptEditorRef);
                    const editor = this.scriptEditorRef.current.editor;
                    editor.setValue(txt);
                } else if (type === 'inputJson') {
                    const editor = this.inputJsonEditorRef.current.editor;
                    editor.setValue(txt);
                }
                this.setState({
                    [type]: e.target.result,
                })
            };
        }
    }

    /**
     * 输入框改变
     * @param e
     */
    inputChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        })
    }
    /**
     * 输入完成
     */
    inputBlur = () => {
        this.runScript();
    }
    /**
     * 校验json是否正确
     */
    parseScript = ()=>{
        const editor =  this.inputJsonEditorRef.current.editor ;
        let value = editor.getValue();
        try {
            value = JSON.stringify(parser.parse(value),null,2);
        } catch (e) {
            console.error(e);
            Modal.error({
                title:'Json检验失败!',
                content:(
                    <div>
                        <p>错误信息如下:</p>
                        <p>{e.message}</p>
                    </div>
                ),
            });
            return false;
        }
        message.success('json检验通过!');
        editor.setValue(value);
        this.setState({inputJson:value});
        return true;
    }
    /**
     * 运行
     */
    runScript = () => {
        if(!this.parseScript()){
            return;
        }
        functionStartTime = new Date();
        // 执行代码
        let funcName = (data) => {
            // console.log('原始的函数:', data);
            return data;
        };
        try{
            eval(`funcName = ${this.state.functionStr}`);
        } catch (e) {
            console.error(e);
            Modal.error({
                title:'脚本运行出现错误！',
                content:(
                  <div>
                      <p>{JSON.stringify(e,null,4)}</p>
                  </div>
              ),
            })
        }
        // console.log('funcName',funcName);
        const result = funcName(this.state.inputJson);

        // 记录结束时间
        const endTime = new Date();
        console.log('开始时间', functionStartTime.getTime());
        console.log('结束时间', endTime.getTime());
        this.setState({
            outputJson: result,
            duration: endTime.getTime() - functionStartTime.getTime(),
        })

    }
    /**
     * 生成脚本
     */
    generateScript = () => {
        let initSys = '';
        let conditionStr = '';
        let result = '';
        for (const sys of this.state.systems) {
            // 初始化数组以及对象
            initSys += `
            var ${sys.sysName} = JSON.parse(data);
            ${sys.sysName}["${this.state.arrayName}"] = [];
            var ${sys.sysName}Messages = [];`
            // for循环
            let aCond = '';
            for (const condition of sys.conditions) {
                aCond += `  ${condition.connectStr}  msg["${condition.keyStr}"] ${condition.relationStr} "${condition.vauleStr}" `;
            }
            conditionStr += `
             ${sys.connectStr} (  ${aCond}   ) {
                 ${sys.sysName}Messages.push(msg);
             }
            `;

            // 赋值给result
            result += `
            ${sys.sysName}["${this.state.arrayName}"] = ${sys.sysName}Messages ;
            result["${sys.sysName}"] = ${sys.sysName};
            `;
        }
        const method = `function ${methodName}(data) {
            var result = {};
            var originData = JSON.parse(data);

            ${initSys}

            var messages = originData["${this.state.arrayName}"];
            if (messages) {
                for (var i = 0; i < messages.length; i++) {
                    var msg = messages[i];
                    ${conditionStr}
                }
            }

            ${result}
            return result;
        }
        `;
      const editor =   this.scriptEditorRef.current.editor;
       // editor.setValue(method);
        // const range = { from: editor.getCursor(true), to: editor.getCursor(false) };
        // editor.autoFormatRange(range.from, range.to);
        const formatMethod = this.getFormatScript(method);
       editor.setValue(formatMethod);
        this.setState({
            functionStr: formatMethod,
        });
    }

    getFormatScript(source) {
        // console.log(get_beautify);
        const formatMethod =  get_beautify(source);

        return formatMethod;
    }

    componentDidCatch(error, info) {
        console.log('componentDidCatch');
        console.log(error, info);
        const isNewError = (error.toString() !== this.state.prevError.toString());// should only run once
        if (isNewError) {//判断两次错误不一致才再次执行，不然一直循环
            this.setState({ prevError: error });
            notification.open({
                message: '错误提示',
                description: '',
                onClick: () => {
                    console.log('Notification Clicked!');
                },
            });
        }
    }

    /**
     * 下载文本
     */
    downloadTxtFile = (txt) => {
        const element = document.createElement("a");
        const file = new Blob([txt], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = "脚本.js";
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
    }

    /**
     * 复制内容到粘贴板
     */
    copyToClip = (content,) => {
        const aux = document.createElement("textarea");
        // aux.setAttribute("value", content);
        aux.value = content;
        document.body.appendChild(aux);
        aux.select();
        document.execCommand("copy");
        document.body.removeChild(aux);
        message.success(`复制成功！`);
    }
}

export default SystemPage;
