import React from 'react';

const CommonDynamicTable = ({ columns, data, handleEdit, handleDelete, handleSearch, searchQuery, pagination }) => {
    return (
        <div>
            {/* Search Box */}
            <div className="searchBox mb-3">
                <input
                    className="searchInput"
                    value={searchQuery}
                    onChange={handleSearch}
                    type="text"
                    placeholder="Search"
                />
                <button className="searchButton" >
                        <svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" viewBox="0 0 29 29" fill="none">
                            <g clipPath="url(#clip0_2_17)"><g filter="url(#filter0_d_2_17)">  <path d="M23.7953 23.9182L19.0585 19.1814M19.0585 19.1814C19.8188 18.4211 20.4219 17.5185 20.8333 16.5251C21.2448 15.5318 21.4566 14.4671 21.4566 13.3919C21.4566 12.3167 21.2448 11.252 20.8333 10.2587C20.4219 9.2653 19.8188 8.36271 19.0585 7.60242C18.2982 6.84214 17.3956 6.23905 16.4022 5.82759C15.4089 5.41612 14.3442 5.20435 13.269 5.20435C12.1938 5.20435 11.1291 5.41612 10.1358 5.82759C9.1424 6.23905 8.23981 6.84214 7.47953 7.60242C5.94407 9.13789 5.08145 11.2204 5.08145 13.3919C5.08145 15.5634 5.94407 17.6459 7.47953 19.1814C9.01499 20.7168 11.0975 21.5794 13.269 21.5794C15.4405 21.5794 17.523 20.7168 19.0585 19.1814Z" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" shapeRendering="crispEdges"></path></g></g>
                            <defs>
                                <filter id="filter0_d_2_17" x="-0.418549" y="3.70435" width="29.7139" height="29.7139" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                    <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood> <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix><feOffset dy="4"></feOffset> <feGaussianBlur stdDeviation="2"></feGaussianBlur> <feComposite in2="hardAlpha" operator="out"></feComposite> <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"></feColorMatrix><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2_17"></feBlend><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2_17" result="shape"></feBlend>
                                </filter>
                                <clipPath id="clip0_2_17">
                                    <rect width="28.0702" height="28.0702" fill="white" transform="translate(0.403503 0.526367)"></rect>
                                </clipPath>
                            </defs>
                        </svg>
               </button>
            </div>

            {/* Table */}
            <table className="table mt-1 table-striped table-hover">
                <thead>
                    <tr className="table-dark">
                        {columns.map((col) => (
                            <th scope="col" key={col.name}>
                                {col.displayName}
                            </th>
                        ))}
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row) => (
                        <tr key={row.id}>
                            {columns.map((col) => (
                                <td key={col.name}>{row[col.name]}</td>
                            ))}
                            <td>
                                <button className="btn btn-success m-1" onClick={() => handleEdit(row)}>
                                    <i className="fa-solid fa-pen-to-square"></i>
                                </button>
                                <button className="btn btn-danger m-1" onClick={() => handleDelete(row.id)}>
                                    <i className="fa-solid fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination */}
            {pagination && (
                <div className="d-flex justify-content-between">
                    <button onClick={pagination.prevPage} disabled={!pagination.hasPrev}>
                        Previous
                    </button>
                    <span>Page {pagination.currentPage} of {pagination.totalPages}</span>
                    <button onClick={pagination.nextPage} disabled={!pagination.hasNext}>
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default CommonDynamicTable;
