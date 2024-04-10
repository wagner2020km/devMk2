import Head from 'next/head';

interface CustomHeadProps {
	iconPath: string;
	title: string;
}

const CustomHead = ({ iconPath, title }: CustomHeadProps) => {
	return (
		<Head>
			<link rel="icon" href={iconPath} />
			<title>{title}</title>
		</Head>
	);
};

export default CustomHead;
