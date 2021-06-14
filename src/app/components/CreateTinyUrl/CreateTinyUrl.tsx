import React, { useCallback, useEffect, useMemo } from 'react';
import {
  Button,
  Card,
  Checkbox,
  DatePicker,
  Form,
  Input,
  notification,
  Typography,
} from 'antd';
import { useFormik } from 'formik';
import { isInvalidTime, URL_REGEX } from "../../../helpers/helpers";
import { inject, observer } from 'mobx-react';
import { APP_STORE, AUTH_STORE } from "../../../constants/stores";
import { AppStore } from '../../../stores/AppStore';
import { AuthStore } from "../../../stores/AuthStore";

const { Text, Paragraph } = Typography;

interface CreateTinyUrlProps {
  [AUTH_STORE]?: AuthStore;
  [APP_STORE]?: AppStore;
}

const CreateTinyUrl: React.FC<CreateTinyUrlProps> = props => {
  const { appStore } = props;

  const item = appStore?.appItem;

  const tinyUrlItem = item?.item;

  const handleSubmit = useCallback(
    async (values, { setSubmitting, setErrors }) => {
      try {
        console.log(values);
        if (!values.requires_password) {
          delete values['username'];
          delete values['password'];
        }
        await props.appStore.createApp(values);
      } catch (e) {
        e.errorsByKey &&
          setErrors({
            email: e.errorsByKey('email'),
            password: e.errorsByKey('password'),
          });
        notification.error({ message: e.message, duration: 2 });
      } finally {
        setSubmitting(false);
      }
    },
    [props.appStore]
  );

  const validateForm = useCallback((values: any) => {
    const errors: any = {};

    if (!values.original_url) {
      errors.original_url = 'This field is required';
    } else if (URL_REGEX.test(values.original_url)) {
      errors.original_url = 'Please enter valid url';
    }

    if (values.requires_password) {
      if (!values.username) {
        errors.username = 'This field is required';
      }

      if (!values.password) {
        errors.password = 'This field is required';
      }
    }

    return errors;
  }, []);

  const formik = useFormik({
    initialValues: {
      original_url: '',
      custom_url: '',
      requires_password: false,
      password: '',
      username: '',
      expiry_time : null
    },
    validate: validateForm,
    onSubmit: handleSubmit,
  });

  useEffect(() => {
    if (
      !formik.values.requires_password &&
      formik.values.username &&
      formik.values.password
    ) {
      formik.setFieldValue('username', '');
      formik.setFieldValue('password', '');
    }
  }, [formik.values]);

  const renderForm = () => (
    <Form
      layout="vertical"
      className="w-450 space-y-4"
      onFinish={formik.handleSubmit}
    >
      <Form.Item label="Enter a long URL to make a TinyURL">
        <Input
          onChange={formik.handleChange}
          name="original_url"
          placeholder="Enter Url"
          value={formik.values.original_url}
          onBlur={formik.handleBlur}
        />
        {formik.touched.original_url && formik.errors.original_url ? (
          <Text type="danger">{formik.errors.original_url}</Text>
        ) : null}
      </Form.Item>
      <Form.Item label="Customize your link">
        <Input
          onChange={formik.handleChange}
          name="custom_url"
          placeholder="Enter Alias"
          value={formik.values.custom_url}
          onBlur={formik.handleBlur}
        />
      </Form.Item>
      <Form.Item>
        <Checkbox
          onChange={() =>
            formik.setFieldValue(
              'requires_password',
              !formik.values.requires_password
            )
          }
          name="requires_password"
          checked={formik.values.requires_password}
        >
          Is Password Required
        </Checkbox>
      </Form.Item>
      {formik.values.requires_password && (
        <>
          <Form.Item label="Username">
            <Input
              onChange={formik.handleChange}
              name="username"
              placeholder="Enter Username"
              value={formik.values.username}
              onBlur={formik.handleBlur}
            />
            {formik.touched.username && formik.errors.username ? (
              <Text type="danger">{formik.errors.username}</Text>
            ) : null}
          </Form.Item>
          <Form.Item label="Password">
            <Input.Password
              onChange={formik.handleChange}
              name="password"
              placeholder="Enter Password"
              value={formik.values.password}
              onBlur={formik.handleBlur}
            />
            {formik.touched.password && formik.errors.password ? (
              <Text type="danger">{formik.errors.password}</Text>
            ) : null}
          </Form.Item>
          <Form.Item label="Expiry Time">
            <DatePicker
              showTime
              onChange={(value, dateString) => formik.setFieldValue("expiry_time", dateString)}
              disabledDate={isInvalidTime}
              name="expiry_time"
              placeholder="Enter Expiry Time"
              value={formik.values.expiry_time}
              onBlur={formik.handleBlur}
            />
          </Form.Item>
        </>
      )}
      <div className="flex items-center justify-center pt-4">
        <Button
          type="primary"
          htmlType="submit"
          disabled={formik.isSubmitting && !formik.isValid}
          loading={formik.isSubmitting}
        >
          Generate Tiny Url
        </Button>
      </div>
    </Form>
  );

  const renderUrl = () => (
    <Form layout={"vertical"} className="w-450 space-y-4">
      <Form.Item label="Original Url">
        <Paragraph copyable>
          {tinyUrlItem.original_url}
        </Paragraph>
      </Form.Item>
      <Form.Item label="Short Url">
        <Paragraph copyable>
          {tinyUrlItem.short_url}
        </Paragraph>
      </Form.Item>
    </Form>
  )

  return (
    <div className="h-full w-full flex items-center justify-center">
      <Card>
        {
          !tinyUrlItem ? renderForm() :renderUrl()
        }
      </Card>
    </div>
  );
};

export default inject(APP_STORE, AUTH_STORE)(observer(CreateTinyUrl));
