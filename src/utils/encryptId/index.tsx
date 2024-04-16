
import React from 'react';
import CryptoJS from 'crypto-js';
import {AccesKey} from '../../services/keyValidationBank'

const k = AccesKey;

export const encryptID = (id: number): string => {
    const encryptedID = CryptoJS.AES.encrypt(id.toString(), k).toString();
    return encryptedID.replace(/\//g, '-');
}
export const decryptID = (encryptedID: string): string | null => {
    console.log('recebendo', encryptedID)
    const sanitizedID = encryptedID.replace(/-/g, '/');
    console.log('validando', sanitizedID)
    try {
        const bytes = CryptoJS.AES.decrypt(sanitizedID, k);
        const decryptedID = bytes.toString(CryptoJS.enc.Utf8);
        console.log('rescripto', decryptedID)
        return decryptedID;
    } catch (error) {
        console.error('Erro ao descriptografar o ID:', error);
        return null;
    }
}
