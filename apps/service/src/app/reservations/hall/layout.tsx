import { Metadata } from "next";
import { FormProviders } from "../components/FormProviders";

type Props = {
  children: React.ReactNode;
};

export const metadata: Metadata = {
  title: "貸しホールお申し込みフォーム",
};

export default function Layout({ children }: Props) {
  return <FormProviders>{children}</FormProviders>;
}
