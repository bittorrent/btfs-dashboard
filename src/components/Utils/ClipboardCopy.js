import React, { useContext } from 'react';
import { message } from 'antd';
import { useIntl } from 'react-intl';
import { mainContext } from 'reducer';
import { CopyToClipboard } from 'react-copy-to-clipboard';

export default function ClipboardCopy({ value, btnText }) {
  const intl = useIntl();
  const { state } = useContext(mainContext);
  const { theme, sidebarShow } = state;

  const success = () => {
    message.success({
      content: intl.formatMessage({ id: 'copied' }),
      className: 'copied_sidebar_show_' + sidebarShow + ' copied_' + theme,
      duration: '1',
    });
  };

  return (
    <CopyToClipboard text={value}>
      <button className="ml-2 rounded copy-btn theme-copy-btn" onClick={success}>
        <i className="fa-regular fa-copy"></i>
        {btnText && <span className="ml-1">{btnText}</span>}
      </button>
    </CopyToClipboard>
  );
}
