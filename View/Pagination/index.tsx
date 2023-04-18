/* eslint-disable linebreak-style */
import Link from 'next/link';
import React, { FC } from 'react';
import style from './Pagination.module.css'

interface PaginationProps {
  pageCounter: number
}

const Pagination : FC<PaginationProps> = ({pageCounter}) => {
  const numberOfButtons = Math.ceil(151 / 20);
  const buttons = new Array(numberOfButtons).fill('').map((el, index) => (
    <li className={style.pageItem} key={index}>
      <Link
        href={`/${index + 1}`}
        className={`btn ${style.pageBtn} ${index + 1 === pageCounter ? style.active : ''}`}
        // onClick={() => dispatch(setPageCounter(index + 1))}
      >
        {index + 1}
      </Link>
    </li>
  ));

  return (
    <div className={style.pagination}>
      <span className={style.page}>
        {`Page ${pageCounter} of ${numberOfButtons}`}
      </span>
      <ul className={style.paginationUl}>
        <li className={style.pageItem}>
          <Link
            href={`/${pageCounter - 1}`}
            className="btn"
            // onClick={() => dispatch(previous())}
            style={{
              display: `${pageCounter === 1 ? 'none' : 'inline'}`,
            }}
          >
            Previous
          </Link>
        </li>
        {buttons}
        <li className={style.pageItem}>
          <Link
            href={`/${pageCounter + 1}`}
            className="btn"
            // onClick={() => dispatch(next())}
            style={{
              display: `${pageCounter === numberOfButtons ? 'none' : 'inline'}`,
            }}
          >
            Next
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Pagination;
