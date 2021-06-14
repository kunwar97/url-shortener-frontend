import { Button, Card, Form, Input, notification, Typography } from 'antd';
import React, { useCallback, useMemo } from 'react';
import * as yup from 'yup';
import WebRoutes from '../../../routes/WebRoutes';
import { useFormik } from 'formik';
import { useHistory, useLocation } from 'react-router-dom';
import { AuthStore } from 'stores/AuthStore';
import { AUTH_STORE } from 'constants/stores';
import {inject, observer } from 'mobx-react';

const { Title, Text } = Typography;

const loginSchema = yup.object().shape({
  email: yup.string().email().required('Email Address is required'),
  password: yup.string().required('Password is required'),
});

interface LoginComponentProps {
  [AUTH_STORE]?: AuthStore;
}

const LoginComponent: React.FC<LoginComponentProps> = props => {
  const history = useHistory();
  const location = useLocation();

  const renderTitle = useMemo(() => <Title level={3}>Login</Title>, []);

  const handleSubmit = useCallback(
    async (values, { setSubmitting, setErrors }) => {
      try {
        console.log(values);
        await props.authStore.login(values.email, values.password);
        console.log(values);
        let redirectUrl = '/';
        // @ts-ignore
        if (location?.state?.redirect_to) {
          // @ts-ignore
          redirectUrl = location.state.redirect_to;
        }
        history.push(redirectUrl);
      } catch (e) {
        e.errorsByKey && setErrors({
          email: e.errorsByKey('email'),
          password: e.errorsByKey('password'),
        });
        notification.error({ message: e.message, duration: 2 });
      } finally {
        setSubmitting(false);
      }
    },
    [history, location, props.authStore]
  );

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: loginSchema,
    onSubmit: handleSubmit,
  });

  return (
    <div className="w-full h-full flex items-center justify-center login-page">
      <Card title={renderTitle}>
        <Form
          className="w-450 space-y-4"
          layout="vertical"
          onFinish={formik.handleSubmit}
        >
          <Form.Item label="Email Address">
            <Input
              onChange={formik.handleChange}
              name="email"
              placeholder="Email Address"
              value={formik.values.email}
              onBlur={formik.handleBlur}
            />
            {formik.touched.email && formik.errors.email ? (
              <Text type="danger">{formik.errors.email}</Text>
            ) : null}
          </Form.Item>
          <Form.Item label="Password">
            <Input.Password
              name="password"
              onChange={formik.handleChange}
              placeholder="Password"
              value={formik.values.password}
              onBlur={formik.handleBlur}
            />
            {formik.touched.password && formik.errors.password ? (
              <Text type="danger">{formik.errors.password}</Text>
            ) : null}
          </Form.Item>
          <div>
            <Text>Don't have account?</Text>
            <a
              href={WebRoutes.auth.register}
              className="ml-1 text-blue hover:underline"
            >
              Register Now
            </a>
          </div>
          <div className="flex items-center justify-center pt-4">
            <Button
              type="primary"
              htmlType="submit"
              disabled={formik.isSubmitting && !formik.isValid}
              loading={formik.isSubmitting}
            >
              Login
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default inject(AUTH_STORE)(observer(LoginComponent));
