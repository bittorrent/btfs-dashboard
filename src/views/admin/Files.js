import React, { useContext } from 'react';
import { mainContext } from 'reducer';
import FilesStats from 'components/Stats/FilesStats.js';
import ImportModal from 'components/Modals/ImportModal.js';
import UploadModal from 'components/Modals/UploadModal.js';
import S3UploadModal from 'components/Modals/S3UploadModal.js';
import DownloadModal from 'components/Modals/DownloadModal.js';
import PreviewModal from 'components/Modals/PreviewModal.js';
import LocalFilesTable from 'components/Tables/LocalFilesTable';
import S3NewBucketModal from 'components/Modals/S3NewBucketModal';
import S3BucketsTable from 'components/Tables/S3BucketsTable';
import S3DownloadModal from 'components/Modals/S3DownloadModal.js';
import S3NewFolderModal from 'components/Modals/S3NewFolderModal.js';
import S3DeleteBucketModal from 'components/Modals/S3DeleteBucketModal.js';
import S3RenameFileModal from 'components/Modals/S3RenameFileModal.js';



export default function Files(props) {
  const { state } = useContext(mainContext);
  const { theme } = state;
  const query = new URLSearchParams(props.location.search);
  const bucketDetail = Number(query.get('bucketDetail'));
  const bucketName = query.get('bucketName');
  const accessKeyId = query.get('accessKeyId');
  const secretAccessKey = query.get('secretAccessKey');


  return (
    <>
      {bucketDetail > 0 && (
        <>
          <S3BucketsTable accessKeyId={accessKeyId} secretAccessKey={secretAccessKey} bucketName={bucketName} color={theme} />
        </>
      )}

      {bucketDetail < 1 && (
        <>
          <FilesStats color={theme} />
          <LocalFilesTable color={theme} />

        </>
      )
      }
      <ImportModal color={theme} />
      <UploadModal color={theme} />
      <DownloadModal color={theme} />
      <PreviewModal color={theme} />
      <S3NewBucketModal color={theme} />
      <S3UploadModal color={theme} />
      <S3DownloadModal color={theme} />
      <S3NewFolderModal color={theme} />
      <S3DeleteBucketModal color={theme} />
      <S3RenameFileModal color={theme} />
    </>

  );

}
