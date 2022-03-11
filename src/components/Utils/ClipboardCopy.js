/*eslint-disable*/
import React from "react";
import {message} from 'antd';
import {useIntl} from 'react-intl';
import {mainContext} from 'reducer';
import {CopyToClipboard} from 'react-copy-to-clipboard';

export default function ClipboardCopy({value}) {

    const intl = useIntl();

    const success = () => {
        message.success(
            {
                content: intl.formatMessage({id: 'copied'}),
                duration: '1'
            });
    };

    return (
        <CopyToClipboard text={value}>
            <a className="ml-2" onClick={success}>
                <i className="fa fa-paste" style={{marginLeft:'15px'}}/>
            </a>
        </CopyToClipboard>
    )
}
