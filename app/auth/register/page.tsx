"use client";

import React from "react";
import AuthFormContainer from "@components/AuthFormContainer";
import { Button, Input } from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useFormik } from "formik";
import * as yup from "yup";
import { filterFormikErrors } from "@/app/utils/formikHelpers";

export default function Register() {
  const validationSchema = yup.object().shape({
    name: yup.string().required("Name is required!"),
    email: yup.string().email("Invalid email!").required("Email is required!"),
    password: yup
      .string()
      .min(8, "Password must be at least 8 characters.")
      .required("Password is required!"),
  });

  const {
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    errors,
    touched,
  } = useFormik({
    initialValues: { name: "", email: "", password: "" },
    validationSchema,
    onSubmit: (values) => {
      fetch("/api/users", {
        method: "POST",
        body: JSON.stringify(values),
      }).then(async (res) => {
        if (res.ok) {
          const result = await res.json();
          console.log(result);
        }
      });
    },
  });

  const { name, email, password } = values;

  const formErrors: string[] = filterFormikErrors(errors, touched, values);

  return (
    <AuthFormContainer title="Create New Account" onSubmit={handleSubmit}>
      <Input
        name="name"
        label="Name"
        crossOrigin={undefined}
        value={name}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      <Input
        name="email"
        label="Email"
        crossOrigin={undefined}
        value={email}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      <Input
        name="password"
        label="Password"
        type="password"
        crossOrigin={undefined}
        value={password}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      <Button type="submit" className="w-full">
        Register
      </Button>
      <div className="">
        {formErrors.map((err) => {
          return (
            <div key={err} className="space-x-1 flex items-center text-red-500">
              <XMarkIcon className="w-4 h-4" />
              <p className="text-xs">{err}</p>
            </div>
          );
        })}
      </div>
    </AuthFormContainer>
  );
}
