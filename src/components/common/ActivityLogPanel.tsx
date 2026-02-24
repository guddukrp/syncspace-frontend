import { ActivityLog } from '../../types/activityLog';
import './ActivityLogPanel.css';

interface ActivityLogPanelProps {
  title: string;
  logs?: ActivityLog[];
}

const ActivityLogPanel = ({ title, logs }: ActivityLogPanelProps) => {
  return (
    <section className="activity-log-panel">
      <h3>{title}</h3>
      {logs && logs.length > 0 ? (
        <ul>
          {logs.map((log) => (
            <li key={log.id}>
              <p className="action">{log.action}</p>
              <p>{log.details}</p>
              <small>{new Date(log.createdAt).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      ) : (
        <p className="empty">No activity logs available.</p>
      )}
    </section>
  );
};

export default ActivityLogPanel;