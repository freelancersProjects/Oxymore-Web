import React from 'react';
import './Table.scss';

export interface TableColumn<T = any> {
  key: string;
  label: string;
  render?: (value: any, item: T) => React.ReactNode;
  className?: string;
}

export interface TableProps<T = any> {
  columns: TableColumn<T>[];
  data: T[];
  emptyMessage?: string;
  className?: string;
}

const OXMTable = <T extends Record<string, any>>({
  columns,
  data,
  emptyMessage = "No data available",
  className = ""
}: TableProps<T>) => {
  if (data.length === 0) {
    return (
      <div className={`oxm-table-empty ${className}`}>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`oxm-table-container ${className}`}>
      <table className="oxm-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} className={column.className}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              {columns.map((column) => (
                <td key={column.key} className={column.className}>
                  {column.render
                    ? column.render(item[column.key], item)
                    : item[column.key]
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OXMTable;
