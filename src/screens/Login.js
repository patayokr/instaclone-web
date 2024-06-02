import {
  faFacebookSquare,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import routes from "./routes";
import AuthLayout from "./components/Auth/AuthLayout";
import Button from "./components/Auth/Button";
import Separator from "./components/Auth/Separator";
import Input from "./components/Auth/Input";
import FormBox from "./components/Auth/FormBox";
import BottomBox from "./components/Auth/BottomBox";
import PageTitle from "./components/PageTitle";
import { useForm } from "react-hook-form";
import FormError from "./components/Auth/FormError";
import { gql, useMutation } from "@apollo/client";
import { logUserIn } from "../apollo";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import Notification from "./components/Notification";

const FacebookLogin = styled.div`
  color: #385285;
  span {
    margin-left: 10px;
    font-weight: 600;
  }
`;

const LOGIN_MUTATION = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      ok
      token
    }
  }
`;

function Login() {
  const location = useLocation();

  const {
    register,
    watch,
    handleSubmit,
    formState,
    getValues,
    setError,
    clearErrors,
  } = useForm({
    mode: "onChange ",
    defaultValues: {
      username: location?.state?.username || "",
      password: location?.state?.password || "",
    },
  });

  const onCompleted = (data) => {
    const {
      login: { ok, error, token },
    } = data;

    if (!ok) {
      return setError("result", {
        message: error,
      });
    }
    if (token) {
      logUserIn(token);
    }
  };
  const [login, { loading }] = useMutation(LOGIN_MUTATION, {
    onCompleted,
  });
  const onSubmitValid = (data) => {
    if (loading) {
      return;
    }
    const { username, password } = getValues();

    login({
      variables: { username, password },
    });
  };

  const clearLoginError = () => {
    clearErrors("result");
  };

  return (
    <AuthLayout>
      <PageTitle title="login"></PageTitle>
      <FormBox>
        <div>
          <FontAwesomeIcon icon={faInstagram} size="3x" />
        </div>
        <Notification line={location?.state?.message}></Notification>
        <form onSubmit={handleSubmit(onSubmitValid)}>
          <Input
            {...register("username", {
              required: "username is required",
              minLength: {
                value: 5,
                message: "Username should be longer than 5 chars. ",
              },
              validate: (currentValue) => true,
            })}
            name="username"
            type="text"
            placeholder="Username"
            onFocus={() => {
              clearLoginError();
            }}
            // hasError={Boolean(formState.errors?.username?.message)}
          />
          <FormError message={formState.errors?.username?.message}></FormError>
          <Input
            {...register("password", { required: "password is required" })}
            name="password"
            type="password"
            placeholder="Password"
            // hasError={Boolean(formState.errors?.password?.message)}
          />
          <FormError message={formState.errors?.password?.message}></FormError>
          <Button
            type="submit"
            value={loading ? "Loading..." : "Log in"}
            disabled={!formState.isValid || loading}
          >
            Log In
          </Button>
          <FormError message={formState.errors?.result?.message}></FormError>
        </form>
        <Separator />
        <FacebookLogin>
          <FontAwesomeIcon icon={faFacebookSquare} />
          <span>Log in with Facebook</span>
        </FacebookLogin>
      </FormBox>

      <BottomBox
        cta={"Don't have an  account?"}
        linkText="Sign Up"
        link={routes.signUp}
      />
    </AuthLayout>
  );
}
export default Login;
