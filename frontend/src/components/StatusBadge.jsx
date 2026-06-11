export default function StatusBadge({ status }) {
  return <span className={`badge ${status?.toLowerCase().replace(/[^a-z]/g, "")}`}>{status}</span>;
}
