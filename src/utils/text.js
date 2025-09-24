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


export const renderNestedJson = data => {
    if (typeof data === 'object' && data !== null) {
      return (
        <div style={{ marginLeft: '16px' }}>
          <p>{Array.isArray(data) ? '[' : '{'}</p>
          {Object.entries(data).map(([key, value]) => (
            <div key={key} style={{ marginLeft: '16px' }}>
              <p>
                {Array.isArray(data) ? '' : <span>{key} : </span>}
                {typeof value === 'object' ? null : JSON.stringify(value)}
              </p>
              {typeof value === 'object' ? renderNestedJson(value) : null}
            </div>
          ))}
          <p>{Array.isArray(data) ? ']' : '}'}</p>
        </div>
      );
    }
    return <p>{JSON.stringify(data)}</p>;
  };
