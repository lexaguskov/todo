import { Button, Result } from "antd";
import { styled } from "styled-components";
import { GithubOutlined } from "@ant-design/icons";

const Auth = ({ clientId }: { clientId: string }) => {
  function loginWithGithub() {
    window.location.assign(`https://github.com/login/oauth/authorize?client_id=${clientId}`);
  }

  return (<Container
    icon={<GithubOutlined />}
    title="Login with Github to start"
    extra={
      <Button type="primary" onClick={loginWithGithub}>
        Login
      </Button>
    }
  />
  )
};

const Container = styled(Result)`
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;


export default Auth;