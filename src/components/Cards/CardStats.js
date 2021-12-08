import React from "react";
import themeStyle from "utils/themeStyle.js";

export default function CardStats({
  color,
  statSubtitle,
  statTitle,
  statArrow,
  statChange,
  statChangeColor,
  statDescription,
  statIconName,
  statIconColor,
}) {
  return (
    <>
      <div className={"relative flex flex-col min-w-0 break-words rounded mb-2 xl:mb-0 shadow-lg " + themeStyle.bg[color]}>
        <div className="flex-auto p-2">
          <div className="flex">
            <div className="relative w-full max-w-full flex-grow flex-1">
              <h5 className="text-blueGray-400 uppercase font-bold text-xs whitespace-nowrap">
                {statSubtitle}
              </h5>
              <span className={"font-semibold text-xl " + themeStyle.text[color]}>
                {statTitle}
              </span>
            </div>
            {
              statIconName ? <div className="relative w-auto pl-2 flex-initial">
                <div
                    className={
                      "text-white p-3 text-center inline-flex items-center justify-center w-8 h-8 shadow-lg rounded-full " +
                      statIconColor
                    }
                >
                  <i className={statIconName}></i>
                </div>
              </div> : null
            }
          </div>
          <p className="whitespace-nowrap text-sm text-blueGray-400 mt-4 ">
            {!statArrow && <span className="whitespace-nowrap">{statDescription}</span>}
            <span className={statChangeColor + " mr-2"}>
              <i
                className={
                  statArrow === "up"
                    ? "fas fa-arrow-up"
                    : statArrow === "down"
                    ? "fas fa-arrow-down"
                    : ""
                }
              ></i>{" "}
              {statChange}
            </span>
            {statArrow && <span className="whitespace-nowrap">{statDescription}</span>}
          </p>
        </div>
      </div>
    </>
  );
}

