import { Key, ReactNode } from "react";

export interface DataSource {
  key: Key;
  [key: string]: ReactNode;
}

export interface Column {
  title: ReactNode;
  dataIndex: string;
  key: Key;
}

type Props = {
  columns: Column[];
  dataSource: DataSource[];
  centered?: boolean;
};

export default function BorderedTable(props: Props): JSX.Element {
  const createTableRow = (dataSource: DataSource, column: Column, index: number): JSX.Element | null => {
    if (index === 0) {
      return (
        <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap text-gray-900" key={column.key}>
          {dataSource[column.dataIndex]}
        </th>
      );
    }

    return (
      <td scope="col" className="border px-6 py-3" key={column.key}>
        {dataSource[column.dataIndex]}
      </td>
    );
  };

  return (
    <div className="relative overflow-x-auto">
      <table
        className={"w-full text-left text-sm text-gray-500 rtl:text-right" + (props.centered ? " text-center" : "")}
      >
        <thead className="bg-gray-50 text-xs text-gray-700 uppercase">
          <tr>
            {props.columns.map((column) => (
              <th scope="col" className="border px-6 py-3" key={column.key}>
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {props.dataSource.map((data) => (
            <tr className="border bg-white" key={data.key}>
              {props.columns.map((column, index) => createTableRow(data, column, index))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
