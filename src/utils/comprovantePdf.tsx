import Pdf from "react-to-pdf";
import { saveAs } from 'file-saver';

export async function  geraPdfComprovante(divReferencia: any, nomeCliente: any) {
	console.log('nome cliente',nomeCliente)
	const options = {}; 
	const pdf = await Pdf(divReferencia, options);
	const pdfBlob = await pdf.output('blob');

	try {
        saveAs(pdfBlob, nomeCliente);
        return 200
    } catch (error) {
        return 200
    }
}


