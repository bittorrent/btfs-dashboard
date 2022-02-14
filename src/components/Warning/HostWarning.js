import React from "react";
import themeStyle from "utils/themeStyle.js";
import {t} from "utils/text.js";

export default function HostWarning({color}) {

  return (
      <>
        <div className='h-full flex text-center items-center'>
          {t('host_warning')}
        </div>
      </>
  );
}
