import React from "react";

const FormComponent = ({
  columns,
  data,
  actions,
  handleInputChange,
  handleAction,
}) => {
  return (
    <table className="table mt-1 table-striped table-hover">
      <thead>
        <tr className="table-dark">
          {columns.map((col) => (
            <th key={col.key} scope="col">
              {col.label}
            </th>
          ))}
          {actions && <th scope="col">Actions</th>}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={row.id || rowIndex}>
            {columns.map((col, colIndex) => {
              const value = row[col.key];
              if (col.type === "radio") {
                return (
                  <td key={`${row.id}-${col.key}-${colIndex}`}>
                    <div className="radio-input-lead">
                      {col.options.map((option) => (
                        <div
                          key={`${row.id}-${col.key}-${option}`}
                          className="me-2"
                        >
                          <input
                            type="radio"
                            id={`${col.key}-${row.id}-${option}`}
                            name={`${col.key}-${row.id}`}
                            value={option}
                            checked={value === option}
                            onChange={() =>
                              handleInputChange(row.id, col.key, option)
                            }
                          />
                          <label htmlFor={`${col.key}-${row.id}-${option}`}>
                            {option}
                          </label>
                        </div>
                      ))}
                    </div>
                  </td>
                );
              }
              if (col.type === "select") {
                return (
                  <td key={`${row.id}-${col.key}-${colIndex}`}>
                    <select
                      className="form-select"
                      value={value}
                      onChange={(e) =>
                        handleInputChange(row.id, col.key, e.target.value)
                      }
                    >
                      {col.options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </td>
                );
              }
              if (col.type === "checkbox") {
                return (
                  <td key={`${row.id}-${col.key}-${colIndex}`}>
                    <label className="checkbox-followup-container d-flex">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) =>
                          handleInputChange(row.id, col.key, e.target.checked)
                        }
                      />
                      <div className="checkmark"></div>
                      <label className="ms-3 fs-5 mt-1">
                        {value ? "Yes" : "No"}
                      </label>
                    </label>
                  </td>
                );
              }
   
              return <td key={`${row.id}-${col.key}-${colIndex}`}>{value}</td>;
            })}
            {actions && (
              <td>
                {actions.map((action, actionIndex) => (
                  <button
                    key={`${row.id}-${action.label}-${actionIndex}`}
                    className={`btn ${action.className} m-1`}
                    onClick={() => handleAction(action.type, row)}
                  >
                    <i className={action.icon}></i> {action.label}
                  </button>
                ))}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default FormComponent;
