import React from "react";
import { FormattedMessage } from "react-intl";

export function Truncate({children}) {
  if (children.length <= 14) {
    return (
        <div className="">
         {children}
        </div>
    )
  }
  if (children.length > 14)
    return (
        <div className="">
            {children.substring(0,7)} ... {children.substring(children.length - 7, children.length)}
        </div>
    )
}

export function t(id) {
  return <FormattedMessage textComponent="option" id={id} />;
}

