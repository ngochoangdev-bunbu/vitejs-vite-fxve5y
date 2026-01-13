interface ModalProps {
  title: string | React.ReactNode;
  children: React.ReactNode;
  submitTitle: string;
  onSubmit: () => void;
  cancelTitle?: string;
  onCancel?: () => void;
}

export const Modal = ({
  title,
  children,
  submitTitle,
  onSubmit,
  cancelTitle,
  onCancel,
}: ModalProps) => {
  return (
    <div
      id={`default-modal`}
      aria-hidden="true"
      className="fixed inset-0 z-50 flex justify-center items-center w-full h-full bg-gray-800 bg-opacity-50"
    >
      <div className="relative p-4 w-full max-w-2xl max-h-full bg-white rounded-lg shadow-sm">
        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
          {typeof title === "string" ? (
            <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          ) : (
            title
          )}
        </div>

        <div className="p-4 md:p-5 space-y-4">{children}</div>

        <div className="flex items-center justify-end p-4 md:p-5 border-t border-gray-200 rounded-b">
          <button
            type="button"
            className="w-28 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-hidden focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            onClick={onSubmit}
          >
            {submitTitle}
          </button>
          {cancelTitle ? (
            <button
              type="button"
              className="w-28 py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-hidden bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100"
              onClick={onCancel}
            >
              {cancelTitle}
            </button>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};
