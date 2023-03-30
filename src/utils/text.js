import React from "react";
import { FormattedMessage } from "react-intl";

export function Truncate({children, className = '', style = {}}) {
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
            {children.substring(0,7)} ... {children.substring(children.length - 7, children.length)}
        </div>
    )
}

export function t(id) {
  return <FormattedMessage textComponent="option" id={id} />;
}

