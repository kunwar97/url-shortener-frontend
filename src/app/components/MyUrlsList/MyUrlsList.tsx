import { Button, Table, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { inject, observer } from 'mobx-react';
import { APP_STORE } from '../../../constants/stores';
import { AppStore } from '../../../stores/AppStore';
import { useHistory } from 'react-router-dom';
import { AppModel } from '../../../models/entities/AppModel';
import WebRoutes from "../../../routes/WebRoutes";
import { DeleteOutlined, LineChartOutlined } from "@ant-design/icons";
import Text from "antd/lib/typography/Text";

interface MyUrlsListProps {
  [APP_STORE]?: AppStore;
}

const MyUrlsList: React.FC<MyUrlsListProps> = props => {
  const history = useHistory();

  const appModelList = props.appStore?.appList?.items;

  const isLoading = props.appStore?.appList?.loading;

  const [deleting, setDeleting] = useState(false);

  const handleDelete = (app: AppModel) => {
    return async(e: any) => {
      setDeleting(true)
      await props.appStore?.deleteApp(app);
      setDeleting(false)
    };
  };

  const handleEdit = (app: AppModel) => {
    return(e: any) => {
      history.push((WebRoutes.app.myUrls.details).replace(":id", `${app.id}`))
    };
  };

  const handleLogClick = (app: AppModel) => {
    return(e: any) => {
      history.push((WebRoutes.app.myUrls.logs).replace(":id", `${app.id}`))
    };
  };


  const columns = [
    {
      title: 'URL Code',
      dataIndex: 'url_code',
      key: 'url_code',
      width: 100,
    },
    {
      title: 'Original URL',
      dataIndex: 'original_url',
      key: 'original_url',
      ellipses: true,
    },
    {
      title: 'Shorten URL',
      dataIndex: 'short_url',
      key: 'short_url',
      ellipses: true,
      render: (value: any) => <Text copyable={true}>{value}</Text>
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 180,
      render: (value: any) => moment(value).format('YYYY-MM-DD HH:MM'),
    },
    {
      title: 'Expiry Time',
      dataIndex: 'expiry_time',
      key: 'expiry_time',
      width: 180,
      render: (value: any) => {

        if (!value) {
          return "N/A";
        }

        if (moment().isSameOrAfter(moment(value))) {
          return "Expired"
        } else {
          return `${moment(value).diff(moment(), "hours")} hrs left`
        }
      },
    },
    {
      title: 'Actions',
      key: 'action',
      render: (text, record) => (
        <div className="flex items-center space-x-2">
          <Tooltip title={'Delete'}>
            <Button
              className="ant-btn-outline "
              onClick={handleDelete(record)}
              icon={<DeleteOutlined />}
            />
          </Tooltip>
          <Tooltip title={'Logs'}>
            <Button className="ant-btn-outline" onClick={handleLogClick(record)} icon={<LineChartOutlined />} />
          </Tooltip>
        </div>
      ),
    },
  ];

  useEffect(() => {
    props.appStore?.fetchApps();
  }, []);

  return (
    <div className="w-full h-full">
      <Table
        bordered
        columns={columns}
        dataSource={appModelList || []}
        pagination={false}
        loading={deleting || isLoading}
      />
    </div>
  );
};

export default inject(APP_STORE)(observer(MyUrlsList));
