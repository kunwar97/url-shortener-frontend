import { APP_STORE } from '../../../constants/stores';
import { AppStore } from '../../../stores/AppStore';
import { inject, observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import {  notification, Table } from "antd";
import { useParams } from 'react-router-dom';
import moment from "moment";

interface AnalyticsProps {
  [APP_STORE]?: AppStore;
}

const Analytics: React.FC<AnalyticsProps> = (props: AnalyticsProps) => {
  const { appStore } = props;

  // @ts-ignore
  const { id } = useParams();

  console.log(id);

  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);

  const fetchLogs = async (id: string) => {
    try {
      setLoading(true);
      const response = await appStore.fetchAppLogs(id);
      setLogs(response.data)
      console.log(response);
    } catch (e) {
      notification.error({ message: e.message, duration: 2 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(id);
  }, []);

  const columns = [
    {
      title: 'IP Address',
      dataIndex: 'ip_address',
      key: 'ip_address',
    },
    {
      title: 'User Agent',
      dataIndex: 'user_agent',
      key: 'user_agent',
      ellipses: true,
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 180,
      render: (value: any) => moment(value).format('YYYY-MM-DD HH:MM'),
    }
  ];


  return (
    <div className="w-full h-full">
      <Table
        bordered
        columns={columns}
        dataSource={logs || []}
        pagination={false}
        loading={loading}
      />
    </div>
  );
};

export default inject(APP_STORE)(observer(Analytics));
