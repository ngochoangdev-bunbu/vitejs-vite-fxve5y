"use client";

import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { signUp, SignUpInput } from "aws-amplify/auth";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@repo/amplify-backend/amplify/data/resource";
import { useRouter } from "next/navigation";

const formFields = {
  signUp: {
    email: {
      order: 1,
      isRequired: true,
    },
    password: {
      order: 2,
      isRequired: true,
    },
    confirm_password: {
      order: 3,
      isRequired: true,
    },
    "custom:Username": {
      order: 4,
      label: "Username",
      placeholder: "Enter your Username",
      isRequired: true,
    },
    "custom:CompanyName": {
      order: 5,
      label: "CompanyName",
      placeholder: "Enter your CompanyName",
    },
    "custom:tel": {
      order: 6,
      label: "tel",
      placeholder: "Enter your tel",
      isRequired: true,
    },
  },
};

export default function Login() {
  const router = useRouter();

  const services = {
    async handleSignUp(input: SignUpInput) {
      const { username, password, options } = input;
      //cognitoにユーザーデータの作成
      const signUpOutput = await signUp({
        username,
        password,
      });
      //dynamoにユーザーデータの作成
      const client = generateClient<Schema>();
      await client.models.User.create(
        {
          id: signUpOutput.userId,
          name: options?.userAttributes["custom:Username"] || "",
          company_name: options?.userAttributes["custom:CompanyName"] || "",
          tel: options?.userAttributes["custom:tel"] || "",
          email: options?.userAttributes["email"] || "",
          owner: signUpOutput.userId,
        },
        {
          authMode: "identityPool",
        },
      );
      return signUpOutput;
    },
  };
  return (
    <Authenticator services={services} formFields={formFields}>
      {({ user }) => {
        if (user) {
          router.push("/");
          return <div>Redirecting...</div>;
        }
        return <div>Loading...</div>;
      }}
    </Authenticator>
  );
}
