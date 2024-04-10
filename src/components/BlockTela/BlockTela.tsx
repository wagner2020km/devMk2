import React, { ReactNode } from 'react';

import Image from 'next/image';

import { MdOutlineSettings } from 'react-icons/md';

import getImg from '../../assets';

import styles from './styles.module.scss';

interface CartaoCardProps {
    enable: boolean;
    htmlContent: ReactNode;
}


export function BlockTela({ isOpen, onClose, children }) {

    if (!isOpen) {
        return null;
      }
    
      return (
        <div className={styles.modalOverlay}>
          <div className={styles.modal} >
            <button className={styles.modalClose} onClick={onClose}>
              X
            </button>
            {children}
          </div>
        </div>
      );
}
