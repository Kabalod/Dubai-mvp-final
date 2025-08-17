import React, { useState } from "react";
import { Form, Input, Button, Typography } from "antd";
import styles from "./RegisterContent.module.scss";

const { Title, Text } = Typography;

const RegisterContent: React.FC = () => {
  const [form] = Form.useForm();
  const [isDisabled, setIsDisabled] = useState(true);

  const onFormChange = () => {
    const values = form.getFieldsValue();
    setIsDisabled(!values.name || !values.password || !values.repeatPassword);
  };

  return (
    <div className={styles.container}>
      <Title level={2} className={styles.title}>Welcome!</Title>
      <Text className={styles.subtitle}>Complete the registration</Text>

      <Form
        form={form}
        onValuesChange={onFormChange}
        className={styles.form}
        layout="vertical"
      >
        <Form.Item
          name="name"
          rules={[{ required: true, message: "Please enter your name" }]}
        >
          <Input size="large" placeholder="Name" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please enter your password" }]}
        >
          <Input.Password size="large" placeholder="Password" />
        </Form.Item>

        <Form.Item
          name="repeatPassword"
          dependencies={["password"]}
          rules={[
            { required: true, message: "Please repeat your password" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Passwords do not match!"));
              },
            }),
          ]}
        >
          <Input.Password size="large" placeholder="Repeat password" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            block
            size="large"
            disabled={isDisabled}
            className={styles.createAccountButton}
          >
            CREATE ACCOUNT
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default RegisterContent;
