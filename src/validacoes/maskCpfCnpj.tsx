import { validateCpf, validateCnpj } from 'validacoes/validarMascaras';
export const virifyCpgCnpjerer = (document: string) => {
    const validaDoc = document
    if (validaDoc.length < 14) {
        if (validateCpf(validaDoc) == true) {
           
        } else {

        }
    }

    if (validaDoc.length <= 11) {

        validaDoc.replace(/(\d{3})(\d)/, '$1.$2')
        validaDoc.replace(/(\d{3})(\d)/, '$1.$2')
        validaDoc.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

        if (validaDoc.length === 11) {

            if (validateCpf(validaDoc) == true) {

            } else {

            }

        }
    } else if (validaDoc.length <= 14) {

        validaDoc.replace(/^(\d{2})(\d)/, '$1.$2')
        validaDoc.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        validaDoc.replace(/\.(\d{3})(\d)/, '.$1/$2')
        validaDoc.replace(/(\d{4})(\d)/, '$1-$2');


        if (validaDoc.length === 14) {

            if (validateCnpj(validaDoc) == true) {

            } else {

            }

        }

        if (validaDoc.length > 14) {
            return;
        }
    }
};

export const virifyCpgCnpj = (document: string) => {
    let maskedValue = '';
    let validaDocument = document.replace(/\D/g, '')
   // console.log('tamanho cnpj', document.length)
    if (validaDocument.length <= 11) { // CPF
        maskedValue = validaDocument.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
       
      } else { // CNPJ
        maskedValue = validaDocument.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
      }

      
      return maskedValue;
};