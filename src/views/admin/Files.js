import React, {useState, useContext, useCallback} from "react";
import {mainContext} from 'reducer';
import {Menu} from 'antd';
import FilesStats from "components/Stats/FilesStats.js";
import LocalFilesTable from "components/Tables/LocalFilesTable.js";
import ReceivedFilesTable from "components/Tables/ReceivedFilesTable.js";
import ImportModal from "components/Modals/ImportModal.js";
import UploadModal from "components/Modals/UploadModal.js";
import DownloadModal from "components/Modals/DownloadModal.js";
import PreviewModal from "components/Modals/PreviewModal.js";
import UploadContractModal from "components/Modals/UploadContractModal.js";
import UploadToBTFSModal from "components/Modals/UploadToBTFSModal.js";
import ManagerModal from "components/Modals/ManagerModal.js";
import themeStyle from "utils/themeStyle.js";

export default function Files() {

    const [current, setCurrent] = useState('localFilesTable');
    const {state} = useContext(mainContext);
    const {theme} = state;

    const handleClick = useCallback(e => {
        setCurrent(e.key);
    }, []);

    return (
        <>
            <FilesStats color={theme}/>
            <div className="flex flex-wrap">
                <div className="w-full mb-2 text-blueGray-700 font-normal uppercase font-bold">
                    <div className="flex justify-between">
                        <div className="">
                        </div>
                    </div>
                </div>

                <ImportModal color={theme}/>

                <div className="w-full">
                    <div className='mb-4'>
                        <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal"
                              style={{'background': 'transparent'}}>
                            <Menu.Item key="localFilesTable">
                                <h5 className={" uppercase font-bold " + themeStyle.title[theme]}>
                                   Local Files
                                </h5>
                            </Menu.Item>
                            <Menu.Item key="receivedFilesTable">
                                <h5 className={" uppercase font-bold "  + themeStyle.title[theme]}>
                                    Received Files
                                </h5>
                            </Menu.Item>
                        </Menu>

                    </div>

                    {current === 'localFilesTable' &&  <LocalFilesTable color={theme}/>}
                    {current === 'receivedFilesTable' &&  <ReceivedFilesTable color={theme}/>}

                </div>
            </div>
            <UploadModal color={theme}/>
            <DownloadModal color={theme}/>
            <PreviewModal color={theme}/>
            <UploadContractModal color={theme}/>
            <UploadToBTFSModal color={theme}/>
            <ManagerModal color={theme}/>
        </>
    );
}
