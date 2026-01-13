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
  const createTableRow = (
    dataSource: DataSource,
    column: Column,
    index: number,
  ): JSX.Element | null => {
    if (index === 0) {
      return (
        <th
          scope="row"
          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
          key={column.key}
        >
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
        className={
          "w-full text-sm text-left rtl:text-right text-gray-500" +
          (props.centered ? " text-center" : "")
        }
      >
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
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
            <tr className="bg-white border" key={data.key}>
              {props.columns.map((column, index) =>
                createTableRow(data, column, index),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
