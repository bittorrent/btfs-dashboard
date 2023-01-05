/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect } from 'react';
import { createPopper } from '@popperjs/core';
import { removeFiles } from 'services/filesService.js';
import Emitter from 'utils/eventBus';
import { t } from 'utils/text.js';

const FileTableDropdown = ({ color, hash, name, size, path, type }) => {
  const [dropdownPopoverShow, setDropdownPopoverShow] = React.useState(false);
  const btnDropdownRef = React.createRef();
  const popoverDropdownRef = React.createRef();
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

  const download = async () => {
    if (type === 1) {
      Emitter.emit('openDownloadModal', { hash: hash, name: name, size: size, type: 1 });
    }
    if (type === 2) {
      Emitter.emit('openDownloadModal', { hash: hash, name: name, size: size, type: 2 });
    }
  };

  const remove = async () => {
    let result = await removeFiles(hash, name, path, type);
    if (result) {
      Emitter.emit('showMessageAlert', { message: 'delete_success', status: 'success', type: 'frontEnd' });
    } else {
      Emitter.emit('showMessageAlert', { message: 'delete_fail', status: 'error', type: 'frontEnd' });
    }
    Emitter.emit('updateFiles');
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
        <i className="fas fa-ellipsis-v"></i>
      </a>
      <div
        ref={popoverDropdownRef}
        className={
          (dropdownPopoverShow ? 'block ' : 'hidden ') +
          '_box-shadow text-base z-50 float-left py-2 list-none text-left rounded shadow-lg min-w-48 theme-bg'
        }>
        <a
          className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent"
          onClick={() => {
            download();
          }}>
          <i className="w-5 mr-3 fas fa-download"></i>
          {t('download')}
        </a>
        <a
          className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent"
          onClick={e => {
            remove();
          }}>
          <i className="w-5 mr-3 fas fa-trash-alt"></i>
          {t('delete')}
        </a>
      </div>
    </>
  );
};

export default FileTableDropdown;
