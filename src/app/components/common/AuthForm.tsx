import React from "react";

type AuthFormProps = {
  title: string;
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

const AuthForm: React.FC<AuthFormProps> = ({ title, children, onSubmit }) => (
  <div className="container mx-auto mt-10 max-w-md">
    <h2 className="text-2xl font-bold mb-5 text-center">{title}</h2>
    <form onSubmit={onSubmit} className="space-y-4">
      {children}
    </form>
  </div>
);

export default AuthForm;
