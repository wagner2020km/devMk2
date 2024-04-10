export function printComprovante(componente: string) {

let printContents = document.getElementById(`${componente}`).innerHTML;

let originalContents = document.body.innerHTML;
document.body.innerHTML = printContents;
window.print();
document.body.innerHTML = originalContents;


};



