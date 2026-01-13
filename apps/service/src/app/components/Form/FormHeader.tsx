import BorderedTable, { Column, DataSource } from "../BorderedTable";

type Props = {
  children: React.ReactNode;
  // 料金テーブル
  tbColumns: Column[];
  tbDataSource: DataSource[];
};

export default function FormHeader({
  children,
  tbColumns,
  tbDataSource,
}: Props): JSX.Element {
  return (
    <>
      <div
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        aria-hidden="true"
        style={{ pointerEvents: "none" }}
      >
        <div
          className="relative left-1/2 -z-10 aspect-1155/678 w-144.5 max-w-none -translate-x-1/2 rotate-30 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-288.75"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>

      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          {children}
          <br />
          お申し込みフォーム
        </h2>
      </div>

      {/* 説明文 */}
      <div className="mx-auto mt-16 max-w-2xl sm:mt-20">
        <div className="border-b border-gray-900/10 pb-12">
          <p className="mt-1 text-sm leading-6 text-gray-600">
            ご希望の日時をお知らせください。折り返し見積書を発行いたします。
            <br />
            ※ 発行まで1日程度お待ちいただきます。
            <br />
            <br />
            空き状況はこちらをご覧ください。
            <br />
            {/* TODO: リンクのCSS */}
            <a
              href="https://obiya-guild.biz/#rental-meeting"
              target="_blank"
              className="text-blue-600"
            >
              オビヤギルド会議室情報
            </a>
            <br />
          </p>

          <p className="mt-5 mb-3 text-sm leading-6 text-gray-600">
            ご利用料金：
          </p>
          <BorderedTable
            columns={tbColumns}
            dataSource={tbDataSource}
            centered
          />
        </div>
      </div>
    </>
  );
}
