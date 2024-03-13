import React, { useEffect } from 'react';
import { createPopper } from '@popperjs/core';
import Emitter from 'utils/eventBus';
import { t } from 'utils/text.js';

// let folderInput = null;

const ImportFilesEncryptDropdown = ({ color, path }) => {
  const [dropdownPopoverShow, setDropdownPopoverShow] = React.useState(false);
  const btnDropdownRef = React.createRef();
  const popoverDropdownRef = React.createRef();
  const openDropdownPopover = () => {
    createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
      placement: 'bottom-start',
    });
    Emitter.emit('closeDropdownPopover');
    setDropdownPopoverShow(true);
  };
  const closeDropdownPopover = () => {
    setDropdownPopoverShow(false);
  };


  const onDecryptFile = e => {
    e.preventDefault();
    Emitter.emit('openDecryptFileModal',{ path: path });
  };

  const onAddEncryptFile = e => {
    e.preventDefault();
    Emitter.emit('openEncryptFileModal',{ path: path });
  };


  useEffect(() => {
    const t = function () {
      closeDropdownPopover();
    };

    Emitter.on('closeDropdownPopover',closeDropdownPopover);
    document.addEventListener('click', t);
    return () => {
      document.removeEventListener('click', t);
     Emitter.removeListener('closeDropdownPopover');
    };
  }, []);

  return (
    <>
      <button
        className="common-btn theme-common-btn mr-4"
        type="button"
        ref={btnDropdownRef}
        onClick={e => {
          e.preventDefault();
          e.stopPropagation();
          e.nativeEvent.stopImmediatePropagation();
          dropdownPopoverShow ? closeDropdownPopover() : openDropdownPopover();
        }}>
        {t('encrypt_decrypt')}
      </button>

      <div
        ref={popoverDropdownRef}
        className={
          (dropdownPopoverShow ? 'block ' : 'hidden ') +
          '_box-shadow text-base z-50 float-left py-2 list-none text-left rounded shadow-lg min-w-48 mt-important theme-bg'
        }>
        <a
          href="#addFile"
          className={'text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent'}
          onClick={onAddEncryptFile}>
          <i className="far fa-file-alt mr-2"></i>
          {t('encrypt_file')}
        </a>
        <a
          href="#addFolder"
          className={'text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent'}
          onClick={onDecryptFile}>
          <i className="far fa-folder mr-2"></i>
          {t('decrypt_file')}
        </a>
      </div>
    </>
  );
};

export default ImportFilesEncryptDropdown;
