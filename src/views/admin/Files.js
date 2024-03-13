import React, { useContext } from 'react';
import { mainContext } from 'reducer';
import FilesStats from 'components/Stats/FilesStats.js';
import ImportModal from 'components/Modals/ImportModal.js';
import UploadModal from 'components/Modals/UploadModal.js';
import EncryptFileModal from 'components/Modals/EncryptFileModal.js';
import DecryptFileModal from 'components/Modals/DecryptFileModal.js';
import EncryptFileCidModal from 'components/Modals/EncryptFileCidModal.js';
import DownloadModal from 'components/Modals/DownloadModal.js';
import PreviewModal from 'components/Modals/PreviewModal.js';
import LocalFilesTable from 'components/Tables/LocalFilesTable';

export default function Files() {
  const { state } = useContext(mainContext);
  const { theme } = state;

  return (
    <>
      <FilesStats color={theme} />
      <LocalFilesTable color={theme} />
      <ImportModal color={theme} />
      <UploadModal color={theme} />
      <EncryptFileCidModal color={theme} />
      <EncryptFileModal color={theme} />
      <DecryptFileModal color={theme} />
      <DownloadModal color={theme} />
      <PreviewModal color={theme} />
    </>
  );
}
