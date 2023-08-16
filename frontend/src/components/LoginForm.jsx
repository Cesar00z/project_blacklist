import { useForm } from "react-hook-form";
import IconsForm from "./IconsForm";
import FormSwitchLink from "./FormSwitchLink";
import styles from "./Forms.module.css";
import { createClient } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const navigate = useNavigate();

  console.log(import.meta.env.VITE_SUPABASE_URL);

  const client = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_KEY
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = handleSubmit(async (data) => {
    // Logic for signing in
    const { user, error } = await client.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    if (error) {
      console.error("Login failed:", error.message);
      if (error.message === "Invalid login credentials") {
        setError("email", {
          message: "Email or password is incorrect",
        });
        setError("password", {
          message: "Email or password is incorrect",
        });
      } else {
        alert("Error: " + error.message);
      }
    } else {
      console.log("Login successful!", user);
      navigate("/");
      reset();
    }
  });

  const emailOptions = {
    required: {
      value: true,
      message: "Escribe un email válido",
    },
  };

  const passwordOptions = {
    required: {
      value: true,
      message: "La contraseña es requerida",
    },
  };

  return (
    <div className={styles.contentForm}>
      <form onSubmit={onSubmit}>
        <p className={styles.title}>iniciar sesion</p>
        <IconsForm type="login" />
        <article className={styles.inputGroup}>
          <IconsForm type="email" />
          <input
            type="email"
            placeholder="Ingresa correo"
            autoComplete="off"
            {...register("email", emailOptions)}
          />
        </article>
        {errors.email && <span>{errors.email.message}</span>}

        <article className={styles.inputGroup}>
          <IconsForm type="password" />
          <input
            type="password"
            placeholder="Ingresa contraseña"
            {...register("password", passwordOptions)}
          />
        </article>
        {errors.password && <span>{errors.password.message}</span>}

        <a href="" className={styles.forgot}>
          ¿Olvidaste tu contraseña?
        </a>

        <button>entrar</button>

        <FormSwitchLink
          spanText="¿No tienes cuenta?"
          linkText="Regístrate"
          to="/signup"
        />
      </form>
    </div>
  );
}
