import React, { useCallback, useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import {inject, observer} from "mobx-react";
import { Button, Card, Form, Input, notification, Typography } from 'antd';
import { useFormik } from 'formik';
import * as yup from 'yup';
import WebRoutes from '../../../routes/WebRoutes';
import { AUTH_STORE } from '../../../constants/stores';
import { AuthStore } from '../../../stores/AuthStore';

const { Title, Text } = Typography;

const registerSchema = yup.object().shape({
  first_name: yup.string().required('First Name is required'),
  last_name: yup.string().required('Last Name is required'),
  email: yup.string().email().required('Email Address is required'),
  password: yup.string().required('Password is required'),
  confirm_password: yup
    .string()
    .required('Confirm Password is required')
    .oneOf([yup.ref('password'), null], 'Password does not match'),
});

interface RegisterComponentProps {
  [AUTH_STORE]?: AuthStore;
}

const RegisterComponent: React.FC<RegisterComponentProps> = props => {
  const history = useHistory();
  const location = useLocation();

  const renderTitle = useMemo(() => <Title level={3}>Register</Title>, []);

  const handleSubmit = useCallback(
    async (values, { setSubmitting, setErrors }) => {
      try {
        await props.authStore.signup(
          values.first_name,
          values.last_name,
          values.email,
          values.password
        );
        let redirectUrl = '/';
        // @ts-ignore
        if (location?.state?.redirect_to) {
          // @ts-ignore
          redirectUrl = location.state.redirect_to;
        }
        history.push(redirectUrl);
      } catch (e) {
        console.log(e);

        e.errorsByKey && setErrors({
          first_name: e.errorsByKey('first_name'),
          last_name: e.errorsByKey('last_name'),
          password: e.errorsByKey('password'),
          email: e.errorsByKey('email'),
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
      confirm_password: '',
      first_name: '',
      last_name: '',
    },
    validationSchema: registerSchema,
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
          <div className="w-full flex justify-between">
            <Form.Item label="First Name" className="w-52 m-0">
              <Input
                onChange={formik.handleChange}
                name="first_name"
                placeholder="First Name"
                value={formik.values.first_name}
                onBlur={formik.handleBlur}
              />
              {formik.touched.first_name && formik.errors.first_name ? (
                <Text type="danger">{formik.errors.first_name}</Text>
              ) : null}
            </Form.Item>
            <Form.Item label="Last Name" className="w-52 m-0">
              <Input
                onChange={formik.handleChange}
                name="last_name"
                placeholder="Last Name"
                value={formik.values.last_name}
                onBlur={formik.handleBlur}
              />
              {formik.touched.last_name && formik.errors.last_name ? (
                <Text type="danger">{formik.errors.last_name}</Text>
              ) : null}
            </Form.Item>
          </div>

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
              onChange={formik.handleChange}
              name="password"
              placeholder="Password"
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />
            {formik.touched.password && formik.errors.password ? (
              <Text type="danger">{formik.errors.password}</Text>
            ) : null}
          </Form.Item>
          <Form.Item label="Confirm Password">
            <Input.Password
              onChange={formik.handleChange}
              name="confirm_password"
              placeholder="Confirm Password"
              value={formik.values.confirm_password}
              onBlur={formik.handleBlur}
            />
            {formik.touched.confirm_password &&
            formik.errors.confirm_password ? (
              <Text type="danger">{formik.errors.confirm_password}</Text>
            ) : null}
          </Form.Item>
          <div>
            <Text>Already have account?</Text>
            <a
              href={WebRoutes.auth.login}
              className="ml-1 text-blue hover:underline"
            >
              Log In
            </a>
          </div>
          <div className="flex items-center justify-center pt-4">
            <Button
              type="primary"
              htmlType="submit"
              disabled={formik.isSubmitting && !formik.isValid}
              loading={formik.isSubmitting}
            >
              Register
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default inject(AUTH_STORE)(observer(RegisterComponent));
