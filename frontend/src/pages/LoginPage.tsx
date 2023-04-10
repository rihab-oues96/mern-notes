import { useState } from "react";
import { useForm } from "react-hook-form";

import * as NotesApi from "../network/notes_api";

import { Alert, Button, Container, Form } from "react-bootstrap";
import note from "../assets/images/note.png";
import TextInputField from "../components/form/TextInputField";
import { UnauthorizedError } from "../errors/http_errors";
import { User } from "../types/user";
import { LoginCredentials } from "../network/notes_api";
import styleUtils from "../styles/utils.module.css";

interface LoginModalProps {
  onLoginSuccessful: (user: User) => void;
}

const LoginPage = ({ onLoginSuccessful }: LoginModalProps) => {
  const [errorText, setErrorText] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginCredentials>();

  const onSubmit = async (credentials: LoginCredentials) => {
    try {
      const user = await NotesApi.login(credentials);
      onLoginSuccessful(user);
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        setErrorText(error.message);
      } else {
        alert(error);
      }
      console.error(error);
    }
  };

  return (
    <Container>
      <div className={`${styleUtils.flexCenter} ${styleUtils.image}`}>
        <img src={note} alt="note" />
      </div>

      {errorText && <Alert variant="danger">{errorText}</Alert>}

      <Form onSubmit={handleSubmit(onSubmit)}>
        <TextInputField
          name="username"
          label="Username"
          type="text"
          placeholder="Username"
          register={register}
          registerOptions={{ required: "Required" }}
          error={errors.username}
        />
        <TextInputField
          name="password"
          label="Password"
          type="password"
          placeholder="Password"
          register={register}
          registerOptions={{ required: "Required" }}
          error={errors.password}
        />
        <Button
          type="submit"
          disabled={isSubmitting}
          className={styleUtils.width100}
        >
          Log In
        </Button>
      </Form>
    </Container>
  );
};

export default LoginPage;
