type Props = {
  type: string;
  name: string;
  step?: string | number;
  autoComplete?: string;
  placeholder?: string;
  inputClassName?: string;
  label?: string;
  labelClassName?: string;
  desc?: string;
  descClassName?: string;
  required?: boolean;
  min?: string | number;
  max?: string | number;
  value?: string | number;
  defaultValue?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
};

export default function FormInput(props: Props): JSX.Element {
  return (
    <>
      <label
        htmlFor={props.name}
        className={
          props.labelClassName
            ? props.labelClassName
            : "block text-sm font-medium leading-6 text-gray-900"
        }
      >
        <p>
          {props.label}
          {props.required ? <span className="text-red-700">*</span> : null}
        </p>
      </label>
      <p
        className={
          props.descClassName
            ? props.descClassName
            : "text-sm leading-6 text-gray-600"
        }
      >
        {props.desc}
      </p>
      <div className="">
        <input
          type={props.type}
          min={props.min}
          max={props.max}
          value={props.value}
          defaultValue={props.defaultValue}
          step={props.step}
          name={props.name}
          id={props.name}
          autoComplete={props.autoComplete}
          placeholder={props.placeholder}
          required={props.required}
          readOnly={props.readOnly}
          className={
            props.inputClassName
              ? props.inputClassName
              : "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          }
          onChange={props.onChange}
        />
      </div>
    </>
  );
}
