const HelloUser = () => {
	const horas = new Date().getHours();

	if (horas < 12) return 'Bom dia';
	if (horas < 18) return 'Boa tarde';
	return 'Boa noite';
};

export default HelloUser;
