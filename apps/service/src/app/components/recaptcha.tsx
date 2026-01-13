//ReCAPTCHAを表示し、pageにトークンを送る
import ReCAPTCHA from "react-google-recaptcha";

interface Props {
  onChange: (token: string | null) => void;
}
const ReCaptchaComponent: React.FC<Props> = ({ onChange }) => {
  return (
    <ReCAPTCHA
      sitekey={`${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
      onChange={onChange}
    />
  );
};

export default ReCaptchaComponent;
