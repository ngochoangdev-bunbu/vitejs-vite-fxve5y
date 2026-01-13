//ReCAPTCHAのトークンを検証するAPIを呼ぶ
const ReCaptchaCheck = async (token: string | null): Promise<boolean> => {
  try {
    if (!token) {
      return false;
    }
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

    const response = await fetch(verificationUrl, {
      method: "POST",
    });
    const data = await response.json();

    if (data.success) {
      return true;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
  return false;
};

export { ReCaptchaCheck };
