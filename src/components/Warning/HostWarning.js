import React from "react";
import {t} from "utils/text.js";

export default function HostWarning() {
  return (
      <>
        <div className='h-full flex text-center items-center'>
          {t('host_warning')}
        </div>
      </>
  );
}
