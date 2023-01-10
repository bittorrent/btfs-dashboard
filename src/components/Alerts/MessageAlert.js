import { message } from 'antd';
import { useEffect } from 'react';
import { useIntl } from 'react-intl';
import Emitter from 'utils/eventBus';

const MessageAlert = () => {
    const intl = useIntl();

    useEffect(() => {
        Emitter.on('showMessageAlert', function (params) {
            const msg = params.type === 'frontEnd' ? intl.formatMessage({ id: params.message }) : params.message;
            if (params.status === 'success') {
                message.success(msg, 2);
            }
            if (params.status === 'warning') {
                message.warning(msg, 2);
            }
            if (params.status === 'error') {
                message.error(msg, 2);
            }
        });
        return () => {
            Emitter.removeListener('showMessageAlert');
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return null;
};

export default MessageAlert;
