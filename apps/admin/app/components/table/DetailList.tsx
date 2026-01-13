import { ReactNode } from "react";

export interface DetailListData {
  name: ReactNode;
  value: ReactNode;
}

type Props = {
  children: ReactNode;
  description?: ReactNode;
  data: DetailListData[];
};

export default function DetailList(props: Props): JSX.Element {
  return (
    <div>
      <div className="px-4 sm:px-0">
        <h3 className="text-base leading-7 font-semibold text-gray-900">{props.children}</h3>
        {props.description ? (
          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">{props.description}</p>
        ) : null}
      </div>
      <div className="mt-6 border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          {props.data.map((item, index) => (
            <div key={index} className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm leading-6 font-medium text-gray-900">{item.name}</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{item.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
