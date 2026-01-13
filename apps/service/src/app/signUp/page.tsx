"use client";

import Button from "@/app/components/ui/button/Button";
import { useMsg } from "@/contexts/MsgContext";
import type { Schema } from "@repo/amplify-backend/amplify/data/resource";
import {
  confirmSignUp,
  resendSignUpCode,
  signUp,
  SignUpInput,
} from "aws-amplify/auth";
import { generateClient } from "aws-amplify/data";
import Link from 'next/link';
import { useRouter } from "next/navigation";
import { useState } from "react";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import { EyeCloseIcon, EyeIcon } from "../icons";

export default function SignUp() {
  const router = useRouter();

  const [isSignUpConfirm, setIsSignUpConfirm] = useState<boolean>(false);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [companyName, setCompanyName] = useState<string>("");
  const [tel, setTel] = useState<string>("");
  const [confirmCode, setConfirmCode] = useState<string>("");
  const [errorText, setErrorText] = useState<string>("");

  const { showMsg } = useMsg();

  // 作成時の入力内容
  const handleChange = (e: any) => {
    switch (e.target.name) {
      case "firstName":
        setFirstName(e.target.value);
        break;
      case "lastName":
        setLastName(e.target.value);
        break;
      case "email":
        setEmail(e.target.value);
        break;
      case "password":
        setPassword(e.target.value);
        break;
      case "confirmPassword":
        setConfirmPassword(e.target.value);
        break;
      case "companyName":
        setCompanyName(e.target.value);
        break;
      case "tel":
        setTel(e.target.value);
        break;
    }
  };

  //サインアップ処理
  async function formSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorText("");

    // 必須フィールドのバリデーション
    if (!firstName || !lastName || !email || !password || !confirmPassword || !tel) {
      setErrorText("すべての項目を入力してください。");
      return;
    }

    if (password !== confirmPassword) {
      setErrorText("パスワードが一致しません。");
      return;
    }

    const signInput: SignUpInput = {
      username: email,
      password: password,
    };

    try {
      //cognitoにユーザーデータの作成
      const signUpOutput = await signUp(signInput);
      //dynamoにユーザーデータの作成
      const client = generateClient<Schema>();
      await client.models.User.create(
        {
          id: signUpOutput.userId,
          name: firstName + lastName,
          company_name: companyName,
          tel: tel,
          email: email,
          owner: signUpOutput.userId,
        },
        {
          authMode: "identityPool",
        },
      );
      setIsSignUpConfirm(true);
    } catch (error: any) {
      setErrorText(error.message);
    }
  }

  //サインアップ確認コード送信
  async function confirmSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email && confirmCode) {
      try {
        await confirmSignUp({
          username: email,
          confirmationCode: confirmCode,
        });
        router.push("/signIn");
      } catch (error: any) {
        setErrorText(error.message)
      }
    }
  }

  //確認コード再送信
  async function resendConfirmCode() {
    if (email) {
      try {
        await resendSignUpCode({
          username: email,
        });
        showMsg("認証コードの再発行", "登録したメールアドレス宛に送信しました。", "閉じる", "info")
      } catch (error: any) {
        setErrorText(error.message)
      }
    }
  }

  //フォーム
  const isSignUpForm = () => {
    if (!isSignUpConfirm) {
      return (
        <div className="flex flex-col min-h-screen">
          <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto px-4 py-4">
            <div>
              <div className="mb-5 sm:mb-8">
                <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                  サインアップ
                </h1>
              </div>
              <div>
                <form onSubmit={formSubmit}>
                  <div className="space-y-6">
                    <div>
                      <Label>
                        姓 <span className="text-error-500">*</span>{" "}
                      </Label>
                      <Input name="firstName" placeholder="山田" value={firstName}
                        onChange={handleChange} />
                    </div>

                    <div>
                      <Label>
                        名 <span className="text-error-500">*</span>{" "}
                      </Label>
                      <Input name="lastName" placeholder="太郎" value={lastName}
                        onChange={handleChange} />
                    </div>

                    <div>
                      <Label>
                        メールアドレス <span className="text-error-500">*</span>{" "}
                      </Label>
                      <Input name="email" type="email" placeholder="example@example.com" value={email}
                        onChange={handleChange} autoComplete="email" />
                    </div>

                    <div>
                      <Label>
                        パスワード <span className="text-error-500">*</span>{" "}
                      </Label>
                      <div className="relative">
                        <Input
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="パスワード"
                          value={password}
                          onChange={handleChange}
                          autoComplete="new-password"
                        />
                        <span
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                        >
                          {showPassword ? (
                            <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                          ) : (
                            <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                          )}
                        </span>
                      </div>
                    </div>

                    <div>
                      <Label>
                        パスワード確認 <span className="text-error-500">*</span>{" "}
                      </Label>
                      <div className="relative">
                        <Input
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="パスワード"
                          value={confirmPassword}
                          onChange={handleChange}
                          autoComplete="new-password"
                        />
                        <span
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                        >
                          {showConfirmPassword ? (
                            <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                          ) : (
                            <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                          )}
                        </span>
                      </div>
                    </div>

                    <div>
                      <Label>
                        会社名
                      </Label>
                      <Input name="companyName" placeholder="株式会社サンプル" value={companyName}
                        onChange={handleChange} />
                    </div>

                    <div>
                      <Label>
                        電話番号 <span className="text-error-500">*</span>{" "}
                      </Label>
                      <Input name="tel" type="tel" placeholder="090-1234-5678" value={tel}
                        onChange={handleChange} />
                    </div>

                    {errorText != "" && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                        {errorText}
                      </p>
                    )}

                    <div>
                      <Button className="w-full" size="sm">
                        サインアップ
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
              <Link
                href="/signIn"
                className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
              >
                サインインに戻る
              </Link>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="flex flex-col min-h-screen">
          <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto px-4">
            <div>
              <div className="mb-5 sm:mb-8">
                <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                  オビヤギルド アカウント作成
                </h1>
              </div>
              <div>
                <form onSubmit={confirmSubmit}>
                  <div className="space-y-6">
                    <div>
                      <Label>
                        認証コード <span className="text-error-500">*</span>{" "}
                      </Label>
                      <Input name="confirmCode" placeholder="******" value={confirmCode}
                        onChange={(e) => {
                          setConfirmCode(e.target.value);
                        }} />
                    </div>

                    {errorText != "" && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                        {errorText}
                      </p>
                    )}

                    <div>
                      <Button className="w-full" size="sm">
                        確認
                      </Button>
                    </div>
                  </div>
                </form>
                <Button className="w-full mt-2" size="sm" onClick={resendConfirmCode}>
                  認証コードを再送信
                </Button>
              </div>
              <Link
                href="/signIn"
                className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
              >
                サインインに戻る
              </Link>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <>{isSignUpForm()}</>
  );
}
