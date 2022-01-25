/*eslint-disable*/
import React, {useContext} from "react";
import {message} from 'antd';
import {useIntl} from 'react-intl';
import {mainContext} from 'reducer';
import {CopyToClipboard} from 'react-copy-to-clipboard';

export default function ClipboardCopy({value}) {

    const intl = useIntl();
    const {state} = useContext(mainContext);
    const {theme, sidebarShow} = state;

    const success = () => {
        message.success(
            {
                content: intl.formatMessage({id: 'copied'}),
                className: 'copied' + '_' + 'sidebar_show' + '_' + sidebarShow + ' ' + 'copied' + '_' + theme,
                duration: '1'
            });
    };

    return (
        <CopyToClipboard text={value}>
            <a className="ml-2" onClick={success}>
                <i className="fa fa-paste"/>
            </a>
        </CopyToClipboard>
    )
}
