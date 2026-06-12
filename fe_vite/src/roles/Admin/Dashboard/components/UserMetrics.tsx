interface Props {
  total: number;
  countGV: number;
  countHS: number;
}

const UserMetrics = ({ total, countGV, countHS }: Props) => {
  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <p className="text-xs text-gray-500">Tổng tài khoản</p>
        <p className="text-2xl font-semibold text-gray-800 mt-1">{total}</p>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <p className="text-xs text-gray-500">Giáo viên</p>
        <p className="text-2xl font-semibold text-blue-700 mt-1">{countGV}</p>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <p className="text-xs text-gray-500">Học sinh</p>
        <p className="text-2xl font-semibold text-green-700 mt-1">{countHS}</p>
      </div>
    </div>
  );
};

export default UserMetrics;
