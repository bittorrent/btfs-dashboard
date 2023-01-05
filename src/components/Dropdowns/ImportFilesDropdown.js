import React, { useEffect } from 'react';
import { createPopper } from '@popperjs/core';
import Emitter from 'utils/eventBus';
import { t } from 'utils/text.js';

let folderInput = null;
let filesInput = null;

const ImportFilesDropdown = ({ color, path }) => {
  const [dropdownPopoverShow, setDropdownPopoverShow] = React.useState(false);
  const btnDropdownRef = React.createRef();
  const popoverDropdownRef = React.createRef();
  const openDropdownPopover = () => {
    createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
      placement: 'bottom-start',
    });
    setDropdownPopoverShow(true);
  };
  const closeDropdownPopover = () => {
    setDropdownPopoverShow(false);
  };

  const normalizeFiles = files => {
    const streams = [];
    for (const file of files) {
      streams.push({
        path: file.filepath || file.webkitRelativePath || file.name,
        content: file,
        size: file.size,
      });
    }
    return streams;
  };

  const onInputChange = async e => {
    let input = e.target.files;
    let file = normalizeFiles(input);
    Emitter.emit('openUploadModal', { data: file, path: path });
    e.target.value = null;
  };

  const onAddFile = async e => {
    e.preventDefault();
    filesInput.click();
  };

  const onAddFolder = e => {
    e.preventDefault();
    folderInput.click();
  };

  const onAddByPath = e => {
    e.preventDefault();
    Emitter.emit('openImportModal', { type: 'byPath', path: path });
  };

  const addNewFolder = e => {
    e.preventDefault();
    Emitter.emit('openImportModal', { type: 'newFolder', path: path });
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

  return (
    <>
      <button
        className="common-btn theme-common-btn"
        type="button"
        ref={btnDropdownRef}
        onClick={e => {
          e.preventDefault();
          e.stopPropagation();
          e.nativeEvent.stopImmediatePropagation();
          dropdownPopoverShow ? closeDropdownPopover() : openDropdownPopover();
        }}>
        <i className="fas fa-plus mr-2"></i>
        {t('import')}
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
          onClick={onAddFile}>
          <i className="far fa-file-alt mr-2"></i>
          {t('file')}
        </a>
        <a
          href="#addFolder"
          className={'text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent'}
          onClick={onAddFolder}>
          <i className="far fa-folder mr-2"></i>
          {t('folder')}
        </a>
        <a
          href="#addByPath"
          className={'text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent'}
          onClick={onAddByPath}>
          <i className="fas fa-link mr-2"></i>
          {t('from')} BTFS
        </a>
        <a
          href="#addByPath"
          className={'text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent'}
          onClick={addNewFolder}>
          <i className="fas fa-folder-plus mr-2"></i>
          {t('new_folder')}
        </a>
      </div>

      <input
        id="file-input"
        type="file"
        className="hidden"
        single="true"
        ref={el => {
          filesInput = el;
        }}
        onChange={onInputChange}
      />

      <input
        id="directory-input"
        type="file"
        className="hidden"
        multiple
        webkitdirectory="true"
        ref={el => {
          folderInput = el;
        }}
        onChange={onInputChange}
      />
    </>
  );
};

export default ImportFilesDropdown;
