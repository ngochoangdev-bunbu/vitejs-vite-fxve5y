interface ErrorBoxProps {
  title: String;
  errorMessage: any;
  active: boolean;
  setActive: (active: boolean) => void;
}

export const ErrorBox = ({
  title,
  errorMessage,
  active,
  setActive,
}: ErrorBoxProps) => {
  return (
    <>
      {active && (
        <div
          id={`default-modal`}
          aria-hidden="true"
          className="fixed inset-0 z-50 flex justify-center items-center w-full h-full bg-gray-800 bg-opacity-50"
        >
          <div className="relative p-4 w-full max-w-2xl max-h-full bg-white rounded-lg shadow-sm">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
              <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
            </div>

            <div className="p-4 md:p-5 space-y-4">{errorMessage}</div>

            <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b">
              <button
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-hidden focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                onClick={() => {
                  setActive(false);
                }}
              >
                確認
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
