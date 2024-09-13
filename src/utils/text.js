import React from "react";
import { FormattedMessage } from "react-intl";

export function Truncate({children, className = '', style = {},start=7,end=7}) {
  if(!children) return '';
  if (children.length <= 14) {
    return (
        <div className={"theme-text-main "+ className} style={style}>
         {children}
        </div>
    )
  }
  if (children.length > 14)
    return (
        <div className={"theme-text-main "+ className} style={style}>
            {children.substring(0,start)} ... {children.substring(children.length - end, children.length)}
        </div>
    )
}

export function t(id) {
  return <FormattedMessage textComponent="option" id={id} />;
}

