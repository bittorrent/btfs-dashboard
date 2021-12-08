import React, {useContext} from "react";
import {mainContext} from 'reducer';
import FilesStats from "components/Stats/FilesStats.js";
import FilesTable from "components/Tables/FilesTable.js";
import ImportModal from "components/Modals/ImportModal.js";
import UploadModal from "components/Modals/UploadModal.js";
import DownloadModal from "components/Modals/DownloadModal.js";
import PreviewModal from "components/Modals/PreviewModal.js";


export default function Files() {

    const {state} = useContext(mainContext);
    const {theme} = state;

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
                    <FilesTable color={theme}/>
                </div>
            </div>
            <UploadModal color={theme}/>
            <DownloadModal color={theme}/>
            <PreviewModal color={theme}/>
        </>
    );
}
