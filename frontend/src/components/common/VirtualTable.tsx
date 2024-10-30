import React from 'react';
import { Table } from 'antd';
import type { TableProps, ColumnType } from 'antd/es/table';
import VirtualList from 'rc-virtual-list';

interface VirtualTableProps<T extends object> extends Omit<TableProps<T>, 'pagination'> {
  height?: number;
  itemHeight?: number;
}

export function VirtualTable<T extends object>({
  dataSource,
  height = 400,
  itemHeight = 54,
  ...props
}: VirtualTableProps<T>) {
  const renderVirtualList = (rawData: readonly T[], { onScroll }: any) => (
    <VirtualList
      height={height}
      itemHeight={itemHeight}
      itemKey="id"
      data={rawData as T[]}
      onScroll={onScroll}
    >
      {(item: T) => (
        <tr key={(item as any).id}>
          {(props.columns as ColumnType<T>[])?.map((column, index) => {
            const value = column.dataIndex ? (item as any)[column.dataIndex] : undefined;
            return (
              <td key={index}>
                {column.render ? column.render(value, item, index) : value}
              </td>
            );
          })}
        </tr>
      )}
    </VirtualList>
  );

  return (
    <Table
      {...props}
      dataSource={dataSource}
      pagination={false}
      components={{
        body: {
          wrapper: renderVirtualList
        },
      }}
    />
  );
}
