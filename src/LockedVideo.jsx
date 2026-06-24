export default function LockedVideo({
  onUnlock
}) {
  return (
    <div className="p-10 text-center">
      <h2 className="text-2xl font-bold mb-4">
        🔒 Video Locked
      </h2>

      <button
        onClick={onUnlock}
        className="bg-red-600 px-6 py-3 rounded-lg"
      >
        Watch Ad & Unlock
      </button>
    </div>
  );
}