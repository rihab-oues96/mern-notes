import { useState } from "react";
import { Alert, Button, Container, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import note from "../assets/images/note.png";
import TextInputField from "../components/form/TextInputField";
import { ConflictError } from "../errors/http_errors";
import { User } from "../types/user";
import * as NotesApi from "../network/notes_api";
import { SignUpCredentials } from "../network/notes_api";
import styleUtils from "../styles/utils.module.css";

interface SignUpModalProps {
  onSignUpSuccessful: (user: User) => void;
}

const Signup = ({ onSignUpSuccessful }: SignUpModalProps) => {
  const [errorText, setErrorText] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpCredentials>();

  async function onSubmit(credentials: SignUpCredentials) {
    try {
      const newUser = await NotesApi.signUp(credentials);
      onSignUpSuccessful(newUser);
    } catch (error) {
      if (error instanceof ConflictError) {
        setErrorText(error.message);
      } else {
        alert(error);
      }
      console.error(error);
    }
  }

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
          name="email"
          label="Email"
          type="email"
          placeholder="Email"
          register={register}
          registerOptions={{ required: "Required" }}
          error={errors.email}
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
          Sign Up
        </Button>
      </Form>
    </Container>
  );
};

export default Signup;
