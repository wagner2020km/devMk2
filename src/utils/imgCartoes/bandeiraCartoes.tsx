import Image from 'next/image';
import getImg from '../../assets/';
export const getImageCard = (value: string) => {
	if (value) {
		switch (value) {
			case 'Visa':
				return <Image src={getImg('bandeirasCartoes/visa.png')} alt="logo" width={40} />
				break;

				case 'Master':
				return <Image src={getImg('bandeirasCartoes/master.png')} alt="logo" width={40} />
				break;
		
			default:
				break;
		}
		
	} else {
		return '';
	}
};