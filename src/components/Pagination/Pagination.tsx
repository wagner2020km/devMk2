/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';

import styles from './styles.module.scss';

const MAX_ITEMS = 10;
const MAX_LEFT = (MAX_ITEMS - 2) / 2;

const Pagination = ({
	limit,
	total,
	offset,
	setOffset,
	nextPage,
	backNextPage,
	totalOfPage,
}) => {
	const current = offset;
	const pages = Math.ceil(total / limit);
	const first = Math.max(current - MAX_LEFT, 1);

	//console.log('Pages', pages)
	//console.log('paginaCorreta', current)
	//console.log('primeira pagina',first)
	function onPageChange(page) {
		setOffset(page);
	}

	return (
		<div className={styles.containerLinkPagination}>
			<button
				className={styles.buttomBackNextPage}
				type="button"
				onClick={() => onPageChange(current - 1)}
				disabled={current === 1}
			>
				Voltar
			</button>
			{ }
			{Array.from({ length: Math.min(MAX_ITEMS, pages) })
				.map((_, index) => index + first)
				.map((page) => (
					(page <= pages) && (
						<div key={page} className={styles.numberPages}>
							<button
								className={
									page === current
										? styles.buttomNumberPagesdisabled
										: styles.buttomNumberPages
								}
								type="button"
								onClick={() => onPageChange(page)}
							>
								{page}
							</button>
						</div>
					)
				))}
			<button
				className={styles.buttomBackNextPage}
				type="button"
				onClick={() => onPageChange(current + 1)}
				disabled={current === pages}
			>
				Proximo
			</button>
		</div>
	);
};

export default Pagination;
