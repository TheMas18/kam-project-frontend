
import React from 'react';

const FilterDropdown = ({ label, options, onFilterChange }) => {
    return (
        <li className="dropdown-submenu">
            <a className="dropdown-item dropdown-toggle" href="#">
                {label}
            </a>
            <ul className="dropdown-menu">
                {options.map((option) => (
                    <li key={option}>
                        <a className="dropdown-item" href="#" onClick={() => onFilterChange(option)}>
                            {option}
                        </a>
                    </li>
                ))}
            </ul>
        </li>
    );
};

export default FilterDropdown;