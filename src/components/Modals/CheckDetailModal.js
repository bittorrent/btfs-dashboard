import React, { useEffect, useContext, useRef } from "react";
import { mainContext } from "reducer";
import Emitter from "utils/eventBus";
import themeStyle from "utils/themeStyle.js";

export default function CheckDetailModal({ color, detailParam }) {
  const { state } = useContext(mainContext);
  const { sidebarShow } = state;
  const [showModal, setShowModal] = React.useState(false);
  const CheckDetailData = useRef({ title: "", dataList: [] });

  useEffect(() => {
    const set = function (params) {
      console.log("openCheckDetailModal event has occured");
      console.log("openCheckDetailModal event has occured",params);
      openModal();
      CheckDetailData.current = params;
    };
    Emitter.on("openCheckDetailModal", set);
    return () => {
      Emitter.removeListener("openCheckDetailModal");
      window.body.style.overflow = "";
    };
  }, []);

  const openModal = () => {
    setShowModal(true);
    window.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setShowModal(false);
    window.body.style.overflow = "";
  };

  return (
    <>
      {showModal ? (
        <>
          <div
            className={
              "fixed flex z-50 md:w-1/2 modal_center md:left-0 md:right-0 mx-auto my-auto md:top-0 md:bottom-0 " +
              (sidebarShow ? "md:left-64" : "")
            }
            style={{ height: "350px" }}
          >
            <button
              className=" absolute right-0 bg-transparent text-2xl mr-2 font-semibold outline-none focus:outline-none text-blueGray-400"
              onClick={closeModal}
            >
              <span>×</span>
            </button>
            <div className="w-full">
              {/*content*/}
              <div
                className={
                  "h-full flex flex-col justify-center items-center border-0 rounded-lg shadow-lg " +
                  themeStyle.bg[color] +
                  themeStyle.text[color]
                }
              >
                <div className="w-full p-8">
                  <h5
                    className={
                      "uppercase font-bold text-center text-2xl " +
                      themeStyle.title[color]
                    }
                  >
                    {CheckDetailData.current.title}
                  </h5>
                  <div className="w-full flex flex-wrap">
                    {CheckDetailData.current.dataList.map((item, index) => {
                      return (
                        <div key={index} className="w-1/2 mt-8">
                          <div className="flex items-center">
                            <img
                              src={
                                require(`assets/img/${item.icon}.svg`).default
                              }
                              alt=""
                              className="mr-4"
                            />
                            <div>
                              <div
                                className={
                                  "font-bold" + themeStyle.title[color]
                                }
                              >
                                {item.value}&nbsp;&nbsp;{item.unit}
                              </div>
                              <div>≈{item.bttValue} BTT</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <hr />
              </div>
            </div>
          </div>
          <div className="bg-opacity-50 bg-black absolute top-0 left-0 w-full h-full inset-0 z-40"></div>
        </>
      ) : null}
    </>
  );
}
