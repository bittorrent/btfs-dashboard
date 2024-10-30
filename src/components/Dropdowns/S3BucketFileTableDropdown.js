/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import { createPopper } from '@popperjs/core';
import Emitter from 'utils/eventBus';
import { t } from 'utils/text.js';
// import { downloadFile } from 'services/s3Service';
import { downloadFile } from 'services/filesService.js';
import * as AWS from "@aws-sdk/client-s3";


const { DeleteObjectsCommand, CopyObjectCommand, ListObjectsCommand } = AWS;


const S3BucketFileTableDropdown = ({ color, item, globalS3, bucketName }) => {
  const [dropdownPopoverShow, setDropdownPopoverShow] = React.useState(false);
  const btnDropdownRef = React.createRef();
  const popoverDropdownRef = React.createRef();
  // eslint-disable-next-line no-unused-vars
  const [err, setErr] = useState(false);

  const openDropdownPopover = () => {
    createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
      placement: 'left-start',
    });
    setDropdownPopoverShow(true);
  };
  const closeDropdownPopover = () => {
    setDropdownPopoverShow(false);
  };

  useEffect(() => {
    const t = function () {
      closeDropdownPopover();
    };
    document.addEventListener('click', t);
    return () => {
      document.removeEventListener('click', t);
    };
  }, []);

  const execDownload = async (setPercentage) => {
    const onDownLoadProgress = progress => {
      const percentage = Math.round((progress.loaded / item.Size) * 100);
      setPercentage(percentage);
    };
    const result = await downloadFile(item.CID, item.Name, item.Size, onDownLoadProgress, setErr);
    return result;
  }



  const download = async () => {
    Emitter.emit('openS3DownloadModal', { name: item.Name, execDownload: execDownload });
  };

  const listFilesInBucket = async () => {
    const command = new ListObjectsCommand({ Bucket: bucketName, Prefix: item.Key });
    const res = await globalS3.send(command);
    const { Contents = [] } = res;
    const keys = Contents.map((c) => c.Key);
    return keys;

  };

  const handleRemove = async () => {
    let keys = [];
    if (item.Type === 2) {
      keys = [item.Key];
      await remove(keys);
    } else {
      keys = await listFilesInBucket();
      await remove(keys);
    }

  }

  const remove = async (keys) => {
    try {

      const deleteObjectsCommand = new DeleteObjectsCommand({
        Bucket: bucketName,
        Delete: { Objects: keys.map((key) => ({ Key: key })) },
      });
      const result = await globalS3.send(deleteObjectsCommand);
      Emitter.emit('updateS3Files');

      if (result) {
        Emitter.emit('showMessageAlert', { message: 'delete_success', status: 'success', type: 'frontEnd' });
      } else {
        Emitter.emit('showMessageAlert', { message: 'delete_fail', status: 'error', type: 'frontEnd' });
      }

    } catch (e) {
      console.log("err", e);
    }
  };

  const renameObject = async (name) => {

    try {
      const commonKeyList = item.Key.split("/");
      let commonKey = "";
      if (commonKeyList.length > 1) {
        commonKey = commonKeyList.slice(0, commonKeyList.length - 1).join("/");
        commonKey = commonKey + "/";
      }
      const command = new CopyObjectCommand({
        Bucket: bucketName,
        CopySource: encodeURIComponent(`${bucketName}/${item.Key}`),
        Key: encodeURIComponent(commonKey + name),
      });

      const response = await globalS3.send(command);

      // delete
      const keys = [item.Key];
      const deleteObjectsCommand = new DeleteObjectsCommand({
        Bucket: bucketName,
        Delete: { Objects: keys.map((key) => ({ Key: key })) },
      });
      await globalS3.send(deleteObjectsCommand);
      console.log("response", response)

      Emitter.emit('updateS3Files');

      if (response) {
        Emitter.emit('showMessageAlert', { message: 's3_rename_success', status: 'success', type: 'frontEnd' });
      } else {
        Emitter.emit('showMessageAlert', { message: 's3_rename_fail', status: 'error', type: 'frontEnd' });
      }
      return response

    } catch (e) {
      console.log("error", e)
      Emitter.emit('showMessageAlert', { message: 's3_rename_fail', status: 'error', type: 'frontEnd' });
      return false;
    }

  }

  const rename = async () => {
    console.log("globalS3", item);
    Emitter.emit('openS3RenameFileModal', { callBackFn: renameObject });
  };

  const trigger = e => {
    e.preventDefault();
    setTimeout(() => {
      dropdownPopoverShow ? closeDropdownPopover() : openDropdownPopover();
    }, 50);
  };

  return (
    <>
      <a
        className="text-blueGray-500 py-1 px-3"
        ref={btnDropdownRef}
        onClick={e => {
          trigger(e);
        }}>
        {

        // <i className="fas fa-ellipsis-v" ></i>

        }
        <img
        alt=""
        className={"hover-hidden " + (dropdownPopoverShow ? 'hidden':'show')}
        src={require('../../assets/img/file-operate.svg').default}
        style={{ width: '24px', height: '24px' }}
        />
        <img
            alt=""
            className={"hover-show " + (dropdownPopoverShow ? 'show':'hidden')}
            src={require('../../assets/img/file-operate-active.svg').default}
            style={{ width: '24px', height: '24px' }}
        />
      </a>
      <div
        ref={popoverDropdownRef}
        className={
          (dropdownPopoverShow ? 'block ' : 'hidden ') +
          '_box-shadow text-base z-50 float-left py-2 list-none text-left rounded shadow-lg min-w-48 theme-bg'
        }>
        {
          item.Type === 2 && <a
            className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent"
            onClick={() => {
              download();
            }}>
            <i className="w-5 mr-3 fas fa-download"></i>
            {t('download')}
          </a>
        }
        {
          item.Type === 2 && <a
            className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent"
            onClick={e => {
              rename();
            }}>
            <i className="w-5 mr-3 fa-regular fa-pen-to-square"></i>
            {t('s3_rename')}
          </a>

        }

        <a
          className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent theme-text-error"
          onClick={e => {
            handleRemove();
          }}>
          <i className="w-5 mr-3 fas fa-trash-alt"></i>
          {t('delete')}
        </a>
      </div>
    </>
  );
};

export default S3BucketFileTableDropdown;
