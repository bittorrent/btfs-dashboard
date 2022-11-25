/*eslint-disable*/
import React from "react";
import { Progress } from "antd";

import themeStyle from "utils/themeStyle.js";
import { t } from "utils/text.js";

export default function MultipleCurrenyList({ color, type, dataList=[] }) {
  console.log("MultipleCurrenyList-dataList",dataList)
  // const dataList = [
  //   {
  //     icon: "wbtt",
  //     cashed: 8000,
  //     unCashed: 2000,
  //     unit: "WBTT",
  //     width: "80%",
  //     cashedValuePercent: 80,
  //     progressColor: "#000000",
  //   },
  //   {
  //     icon: "trx",
  //     cashed: 800,
  //     unCashed: 1200,
  //     unit: "TRX",
  //     width: "10%",
  //     cashedValuePercent: 80,
  //     progressColor: "#FF0000",
  //   },
  //   {
  //     icon: "usdd",
  //     cashed: 800,
  //     unCashed: 1200,
  //     unit: "USDD_t",
  //     width: "10%",
  //     cashedValuePercent: 80,
  //     progressColor: "#006E57",
  //   },
  //   {
  //     icon: "usdt",
  //     cashed: 0,
  //     unCashed: 0,
  //     unit: "USDT_t",
  //     width: "0%",
  //     cashedValuePercent: 80,
  //     progressColor: "#0AB194",
  //   },
  // ];

  return (
    <div className={"w-full " + themeStyle.bg[color] + themeStyle.text[color]}>
      {dataList.map((item, index) => {
        return (
          <div key={index} className="w-full mt-8">
            <div className="flex items-center">
              <div>
                <img
                  src={require(`assets/img/${item.icon}.svg`).default}
                  alt=""
                  className="mr-6"
                />
                <div className={"font-bold" + themeStyle.title[color]}>
                  {item.unit}
                </div>
              </div>
              {type === "sentCheques" ? (
                <div className="w-full relative " >
                  <div className={"w-full relative " + themeStyle.title[color]}>
                    <span className="font-bold">{item.cashed}</span>
                  </div>
                  <div className="relative" style={{ width: item.width }}>
                    <Progress
                      className={color}
                      percent={100}
                      showInfo={false}
                      strokeWidth={14}
                      strokeColor={item.progressColor}
                    />
                  </div>
                </div>
              ) : (
                <div className="w-full relative">
                  <div
                    className={
                      "relative  flex justify-between " +
                      themeStyle.title[color]
                    }
                    style={{ width: "80%" }}
                  >
                    <div>
                      <span className="mr-2">{t("cashed")}</span>
                      <span className="font-bold">{item.cashed}</span>
                    </div>
                    <div>
                      <span className="mr-2">{t("uncashed")}</span>
                      <span className="font-bold">{item.unCashed}</span>
                    </div>
                  </div>
                  <div className="relative" style={{ width: item.width }}>
                    <Progress
                      className={color}
                      percent={item.cashedValuePercent}
                      showInfo={false}
                      strokeWidth={14}
                      strokeColor={item.progressColor}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
