import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import routes from "./routes";
import AuthLayout from "./components/Auth/AuthLayout";
import Button from "./components/Auth/Button";
import Input from "./components/Auth/Input";
import FormBox from "./components/Auth/FormBox";
import BottomBox from "./components/Auth/BottomBox";
import styled from "styled-components";
import { FatLink } from "./components/shared";
import PageTitle from "./components/PageTitle";
import { useForm } from "react-hook-form";
import FormError from "./components/Auth/FormError";
import { gql, useMutation } from "@apollo/client";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Subtitle = styled(FatLink)`
  font-size: 16px;
  text-align: center;
  margin-top: 10px;
`;

const CREATE_ACCOUNT_MUTATION = gql`
  mutation createAccount(
    $firstName: String!
    $lastName: String
    $username: String!
    $email: String!
    $password: String!
  ) {
    createAccount(
      firstName: $firstName
      lastName: $lastName
      username: $username
      email: $email
      password: $password
    ) {
      ok
      error
    }
  }
`;

function SignUp() {
  const history = useHistory();
  const onCompleted = (data) => {
    const { username, password } = getValues();
    const {
      createAccount: { ok, error },
    } = data;
    if (!ok)
      return setError("result", {
        message: error,
      });

    history.push(routes.home, {
      message: "Account created please log in.",
      username,
      password,
    });
  };
  const [createAccount, { loading }] = useMutation(CREATE_ACCOUNT_MUTATION, {
    onCompleted,
  });
  const { formState, setError, handleSubmit, register, getValues } = useForm({
    mode: "onChange",
  });
  const onSubmitValid = (data) => {
    if (loading) return;
    createAccount({
      variables: {
        ...data,
      },
    });
  };

  return (
    <AuthLayout>
      <PageTitle title="Sign up"></PageTitle>
      <FormBox>
        <HeaderContainer>
          <FontAwesomeIcon icon={faInstagram} size="3x" />
          <Subtitle>
            Sign up to see photos and videos from your friends.{" "}
          </Subtitle>
        </HeaderContainer>
        <form onSubmit={handleSubmit(onSubmitValid)}>
          <Input
            name="firstName"
            {...register("firstName", { required: "First name is required" })}
            type="text"
            placeholder="First Name"
            hasError={Boolean(formState.errors?.firstName)}
          />
          <FormError message={formState.errors?.firstName?.message}></FormError>
          <Input
            name="lastName"
            {...register("lastName", { required: false })}
            type="text"
            placeholder="Last Name"
            hasError={Boolean(formState.errors?.lastName)}
          />
          <FormError message={formState.errors?.lastName?.message}></FormError>
          <Input
            name="email"
            {...register("email", { required: "Email is required" })}
            type="text"
            placeholder="Email"
            hasError={Boolean(formState.errors?.email)}
          />
          <FormError message={formState.errors?.email?.message}></FormError>
          <Input
            name="username"
            {...register("username", { required: "username is required" })}
            type="text"
            placeholder="Username"
            hasError={Boolean(formState.errors?.username)}
          />
          <FormError message={formState.errors?.username?.message}></FormError>
          <Input
            name="password"
            {...register("password", { required: "password is required" })}
            type="password"
            placeholder="Password"
            hasError={Boolean(formState.errors?.password)}
          />
          <FormError message={formState.errors?.password?.message}></FormError>
          <Button
            type="submit"
            value={loading ? "Loading..." : "Sign up"}
            disabled={!formState.isValid || loading}
          >
            Log In
          </Button>
        </form>
      </FormBox>

      <BottomBox
        cta={"Have an  account?"}
        linkText="Log in"
        link={routes.home}
      />
    </AuthLayout>
  );
}
export default SignUp;
