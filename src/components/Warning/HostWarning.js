import React from 'react';
import { t } from 'utils/text.js';

export default function HostWarning() {
  return <div className="h-full flex justify-center items-center theme-text-main">{t('host_warning')}</div>;
}
