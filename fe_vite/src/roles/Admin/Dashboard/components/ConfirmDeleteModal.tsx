import { TbX } from "react-icons/tb";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmDeleteModal = ({ open, onClose, onConfirm }: Props) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl border border-gray-200 p-6 w-80">
        <div className="flex justify-between items-start mb-3">
          <p className="font-medium text-gray-800">Xác nhận xóa tài khoản</p>
          <button onClick={onClose}>
            <TbX size={18} className="text-gray-400 hover:text-gray-600" />
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-5">
          Hành động này không thể hoàn tác. Tài khoản sẽ bị xóa vĩnh viễn.
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
