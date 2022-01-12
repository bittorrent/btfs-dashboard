import React from "react";
import themeStyle from "utils/themeStyle.js";
import {t} from "utils/text.js";

export default function CardWarning({color, loading}) {

    return (
        <>
            <div className={"relative flex flex-col min-w-0 break-words w-full mb-6 shadow-xl rounded-lg mt-16 " + themeStyle.bg[color] + themeStyle.text[color]}>
                <div className="px-6">
                    <div className="flex flex-wrap justify-center">
                        <div className="w-full px-4 flex justify-center">
                            <div className="relative">
                                {
                                    !loading && <img
                                    alt="..."
                                    src={require("assets/img/disconnected.png").default}
                                    className={"shadow-xl rounded-full h-auto align-middle border-none absolute -m-16 -ml-20 lg:-ml-16 max-w-150-px " + themeStyle.bg[color]}
                                />
                                }
                                {
                                    loading && <img src={require("assets/img/gear.svg").default} alt="" className={"shadow-xl rounded-full h-auto align-middle border-none absolute -m-16 -ml-20 lg:-ml-16 max-w-150-px loading " + themeStyle.bg[color]}/>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="mt-20 py-10 border-blueGray-200 text-center">
                        <div className="flex flex-wrap justify-center">
                            <div className="w-full lg:w-9/12 px-4">
                                {
                                    !loading && <p className="mb-4 text-lg leading-relaxed">
                                        {t('node_not_connected')}
                                   </p>
                                }
                                {
                                    loading && <p className="mb-4 text-lg leading-relaxed">
                                        {t('node_connecting')}
                                    </p>
                                }
                                <a
                                    href="https://discord.gg/f6agJsxY"
                                    target='_blank'
                                    rel="noreferrer"
                                    className={"font-normal " + themeStyle.link[color]}
                                >
                                    {t('still_not_working')}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
