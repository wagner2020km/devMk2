import Container from 'layout/Container';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Accordion from 'react-bootstrap/Accordion';

import Alert from 'react-bootstrap/Alert';

import ProgressBar from 'react-bootstrap/ProgressBar';

import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

import { Helmet } from 'react-helmet';

function AutoLayoutExample() {
	return (
		<Container>
			<Helmet>
				<link
					rel="stylesheet"
					href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
				/>
			</Helmet>
			<Tabs
				defaultActiveKey="profile"
				id="uncontrolled-tab-example"
				className="mb-3"
			>
				<Tab eventKey="home" title="Home">
					Tab content for Home
				</Tab>
				<Tab eventKey="profile" title="Profile">
					Tab content for Profile
				</Tab>
				<Tab eventKey="contact" title="Contact" disabled>
					Tab content for Contact
				</Tab>
			</Tabs>
			<Row>
				<Col>1 of 2</Col>
				<Col>2 of 2</Col>
			</Row>
			<Row>
				<Col>1 of 3</Col>
				<Col>2 of 3</Col>
				<Col>3 of 3</Col>
			</Row>
			<Accordion defaultActiveKey="0">
				<Accordion.Item eventKey="0">
					<Accordion.Header>Accordion Item #1</Accordion.Header>
					<Accordion.Body>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
						eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
						ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
						aliquip ex ea commodo consequat. Duis aute irure dolor in
						reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
						pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
						culpa qui officia deserunt mollit anim id est laborum.
					</Accordion.Body>
				</Accordion.Item>
				<Accordion.Item eventKey="1">
					<Accordion.Header>Accordion Item #2</Accordion.Header>
					<Accordion.Body>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
						eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
						ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
						aliquip ex ea commodo consequat. Duis aute irure dolor in
						reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
						pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
						culpa qui officia deserunt mollit anim id est laborum.
					</Accordion.Body>
				</Accordion.Item>
			</Accordion>
			<>
				{['primary', 'danger', 'warning'].map((variant) => (
					<Alert key={variant} variant={variant}>
						This is a {variant} alert—check it out!
					</Alert>
				))}
			</>
			<ProgressBar now={60} />
			<div style={{ height: 100 }} />
		</Container>
	);
}

export default AutoLayoutExample;
