"use client";

import { signIn } from "aws-amplify/auth";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link'
import { EyeCloseIcon, EyeIcon } from "../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../components/ui/button/Button";

export default function SignInForm() {
    const router = useRouter();

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [errorText, setErrorText] = useState<string>("");
    const [showPassword, setShowPassword] = useState(false);
    const [isChecked, setIsChecked] = useState(false);

    // 作成時の入力内容
    const handleChange = (e: any) => {
        switch (e.target.name) {
            case "email":
                setEmail(e.target.value);
                break;
            case "password":
                setPassword(e.target.value);
                break;
        }
    };

    //サインイン処理
    async function formSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErrorText("")
        if (email && password) {
            try {
                const result = await signIn({
                    username: email,
                    password: password,
                });

                router.push("/dashboard");
            } catch (error: any) {
                setErrorText(error.message)
            }
        }
    }

    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto px-4">
                <div>
                    <div className="mb-5 sm:mb-8">
                        <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                            サインイン
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            メールアドレスとパスワードを入力してください
                        </p>
                    </div>
                    <div>
                        <form onSubmit={formSubmit}>
                            <div className="space-y-6">
                                <div>
                                    <Label>
                                        メールアドレス <span className="text-error-500">*</span>{" "}
                                    </Label>
                                    <Input name="email" placeholder="info@gmail.com" value={email}
                                        onChange={handleChange} />
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
                                <div className="flex justify-end">
                                    <Link
                                        href="/resetPassword"
                                        className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                                    >
                                        パスワードをお忘れの方
                                    </Link>
                                </div>

                                {errorText != "" && (
                                    <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                                        {errorText}
                                    </p>
                                )}
                                <div>
                                    <Button className="w-full" size="sm">
                                        サインイン
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
