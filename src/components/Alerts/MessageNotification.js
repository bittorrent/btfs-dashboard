import { notification } from 'antd';
import { useEffect } from 'react';
import { useIntl } from 'react-intl';
import Emitter from 'utils/eventBus';

const MessageNotification = () => {
    const intl = useIntl();

    useEffect(() => {
        Emitter.on('showMessageNotification', function (params) {
            const msg = params.type === 'frontEnd' ? intl.formatMessage({ id: params.message }) : params.message;
            if (params.status === 'success') {
                notification.success({
                    placement: 'topRight',
                    duration: 5,
                    description: msg,
                });
            }
            if (params.status === 'warning') {
                notification.warning({
                    placement: 'topRight',
                    duration: 5,
                    description: msg,
                });
            }
            if (params.status === 'error') {
                notification.error({
                    className: 'login-notification-error',
                    placement: 'topRight',
                    duration: 5,
                    description: msg,
                });
            }
        });
        return () => {
            Emitter.removeListener('showMessageNotification');
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [intl]);

    return null;
};

export default MessageNotification;
