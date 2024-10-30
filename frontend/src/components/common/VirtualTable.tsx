import React from 'react';
import { Table } from 'antd';
import type { TableProps } from 'antd';
import VirtualList from 'rc-virtual-list';

interface VirtualTableProps<T> extends Omit<TableProps<T>, 'pagination'> {
  height?: number;
  itemHeight?: number;
}

export function VirtualTable<T extends object>({
  dataSource,
  height = 400,
  itemHeight = 54,
  ...props
}: VirtualTableProps<T>) {
  return (
    <Table
      {...props}
      dataSource={dataSource}
      pagination={false}
      components={{
        body: ({
          data,
          onRow,
        }: {
          data: readonly T[];
          onRow: (record: T) => React.HTMLAttributes<HTMLElement>;
        }) => (
          <VirtualList
            data={data}
            height={height}
            itemHeight={itemHeight}
            itemKey="id"
          >
            {(item: T) => {
              const rowProps = onRow?.(item);
              return (
                <tr {...rowProps}>
                  {props.columns?.map((column, index) => (
                    <td key={index}>
                      {column.render
                        ? column.render(column.dataIndex && item[column.dataIndex as keyof T], item)
                        : column.dataIndex && item[column.dataIndex as keyof T]}
                    </td>
                  ))}
                </tr>
              );
            }}
          </VirtualList>
        ),
      }}
    />
  );
}
