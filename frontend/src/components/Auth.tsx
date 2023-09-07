
import { Button, Result } from "antd";
import { styled } from "styled-components";
import { GithubOutlined } from "@ant-design/icons";
import { SERVER_HOSTNAME } from "../lib/config";
import { redirect } from "../lib/utils";

const Auth = () => {
  async function loginWithGithub() {
    // redirect to the backend server to initiate the OAuth flow
    redirect(`${SERVER_HOSTNAME}/auth/github`);
  }

  return (
    <Container
      icon={<GithubOutlined />}
      title="Login with Github to start"
      extra={
        <Button type="primary" onClick={loginWithGithub}>
          Login
        </Button>
      }
    />
  );
};

// center the content in the screen
const Container = styled(Result)`
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export default Auth;
