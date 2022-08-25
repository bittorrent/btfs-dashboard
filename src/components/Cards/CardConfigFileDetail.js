/*eslint-disable*/
import React, { useState, useRef, useEffect, useContext } from "react";
import ReactJson from "react-json-view";
import { Breadcrumb } from "antd";
import { t } from "utils/text.js";
import { Link } from "react-router-dom";
import themeStyle from "utils/themeStyle.js";
import {
  getHostConfigData,
} from "services/otherService.js";

export default function CardConfigFileDetail({ color }) {
  const jsonTheme = themeStyle.bg[color].includes("white")
    ? "monokai"
    : "ocean";
  const [nodeData,setNodeData] = useState({});
  const fetchData = async () => {
    const data = await getHostConfigData();
    setNodeData(() => {
      return data;
    });
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div
      className={
        "mb-4 p-4 shadow-lg rounded-lg border-0 " +
        themeStyle.bg[color] +
        themeStyle.text[color]
      }
    >
      <div>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link
              to={{
                search: "?fileDetail=0",
              }}
            >
              <span>{t("setting_breadcrumb")}</span>
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            {t("setting_file_config_breadcrumb")}
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="text-xs my-4 text-gray-400">{t("setting_file_config_breadcrumb_des")}</div>
      <ReactJson
        src={nodeData}
        displayObjectSize={false}
        quotesOnKeys={false}
        displayArrayKey={false}
        displayDataTypes={false}
        theme={jsonTheme}
      />
    </div>
  );
}
